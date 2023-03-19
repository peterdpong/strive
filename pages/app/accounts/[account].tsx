import {
  Heading,
  Table,
  TableContainer,
  Thead,
  Td,
  Tr,
  Th,
  Tbody,
  Box,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/app/Sidebar";
import { useAuth } from "../../../src/auth/auth";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import { Transaction } from "../../../src/models/BudgetModel";
import { Timestamp } from "firebase/firestore";

function getDisplayDate(dateString: string) {
  const date = new Date(dateString);
  const displayDate = date.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return displayDate;
}

const AccountTransactions = ({
  account,
  monthTransactionsMap,
}: {
  account: string | string[];
  monthTransactionsMap: { [key: string]: Transaction[] };
}) => {
  if (!monthTransactionsMap) {
    return <Box>Loading data...</Box>;
  }

  const accountTransactions = Object.keys(monthTransactionsMap).reduce(
    (allMonths: Transaction[], currMonth) => {
      return allMonths.concat(
        monthTransactionsMap[currMonth].filter(
          (transaction) => transaction.account.split(" ").join("-") === account
        )
      );
    },
    []
  );

  const sortedTransactions = accountTransactions.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  return (
    <TableContainer mt="10px">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Transaction Date</Th>
            <Th>Account</Th>
            <Th>Name</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedTransactions.map((transaction, i) => (
            <Tr key={i}>
              <Td>{getDisplayDate(transaction.date)}</Td>
              <Td>{transaction.account}</Td>
              <Td>{transaction.name}</Td>
              <Td isNumeric>
                {parseFloat(transaction.amount.toString()).toFixed(2)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default function AccountPage() {
  const router = useRouter();
  const { account } = router.query;
  const accountName =
    typeof account === "string" ? account.split("-").join(" ") : "";

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const accountData = userData?.financialInfo.accounts;

  if (!accountData) return null;

  let accountDetails = {};
  if (accountName in accountData.bankAccounts) {
    accountDetails = accountData.bankAccounts[accountName];
  }
  if (accountName in accountData.creditCards) {
    accountDetails = accountData.creditCards[accountName];
  }
  if (accountName in accountData.loans) {
    accountDetails = accountData.loans[accountName];
  }
  if (accountName in accountData.fixedInvestments) {
    accountDetails = accountData.fixedInvestments[accountName];
  }
  if (accountName in accountData.otherAssets) {
    accountDetails = accountData.otherAssets[accountName];
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <HStack justifyContent="space-between">
            <Heading size="lg" mr="2.5rem">
              {accountName} Transactions
            </Heading>
          </HStack>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          {Object.entries(accountDetails).map(([detail, data]) => {
            if (detail !== ("name" || "type"))
              return (
                <Box>
                  <Stat>
                    <StatLabel>{detail}</StatLabel>
                    <StatNumber>
                      {detail === "value" && "$"}
                      {typeof data === "string" || typeof data === "number"
                        ? data
                        : (data as Timestamp)
                            .toDate()
                            .toISOString()
                            .substring(0, 10)}
                      {detail === "interestRate" && "%"}
                    </StatNumber>
                  </Stat>
                </Box>
              );
          })}
        </Box>
        <Box
          bg={"gray.100"}
          rounded={"5px"}
          padding="6"
          width={"100%"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <HStack justifyContent="space-between">
            <Heading size={"md"}>Account Transactions</Heading>
          </HStack>
          {account && userData && userData.monthTransactionsMap && (
            <AccountTransactions
              account={account}
              monthTransactionsMap={userData?.monthTransactionsMap}
            />
          )}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
