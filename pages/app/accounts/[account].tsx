import {
  Container,
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
  Flex,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/app/Sidebar";
import { useAuth } from "../../../src/auth/auth";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import { Transaction } from "../../../src/models/BudgetModel";

function getDisplayDate(dateString: string) {
  const date = new Date(dateString);
  const displayDate = date.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return displayDate;
}

const AccountTransactions = ({ account }: { account: string | string[] }) => {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const accountData = userData?.financialInfo.accounts;
  const monthTransactionsMap = userData?.monthTransactionsMap;

  if (!monthTransactionsMap) {
    return <Box>Loading data...</Box>;
  }

  const accountTransactions = Object.keys(monthTransactionsMap).reduce(
    (allMonths: Transaction[], currMonth) => {
      return allMonths.concat(
        monthTransactionsMap[currMonth].filter(
          (transaction) =>
            transaction.account.toLowerCase().split(" ").join("-") === account
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
              {/* {editing && (
                <Button
                  size="xs"
                  colorScheme="linkedin"
                  onClick={(e) =>
                    deleteTransactionHandler(e, monthSection, transaction)
                  }
                >
                  Delete
                </Button>
              )} */}
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

  return (
    <ProtectedRoute>
      <Sidebar>
        <Heading>Account Page</Heading>
        <Box
          bg={"gray.100"}
          rounded={"5px"}
          p={"20px"}
          width={"100%"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <HStack justifyContent="space-between">
            <Heading size={"md"}>Account Transactions</Heading>
          </HStack>
          {account && <AccountTransactions account={account} />}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
