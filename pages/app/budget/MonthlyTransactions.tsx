import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  addTransaction,
  deleteTransaction,
} from "../../../src/firebase/UserActions";
import {
  Transaction,
  TransactionCategories,
} from "../../../src/models/BudgetModel";
import { UserModel } from "../../../src/models/UserModel";
import { getCurrentDate, getMonth } from "../../../src/DateTimeUtils";

const AddTransactionsForm = ({ data }: { data: UserModel }) => {
  const dataAccounts = data.financialInfo.accounts;
  const accounts = [
    ...Object.keys(dataAccounts.bankAccounts),
    ...Object.keys(dataAccounts.creditCards),
    ...Object.keys(dataAccounts.fixedInvestments),
    ...Object.keys(dataAccounts.loans),
  ];
  const categories = Object.values(TransactionCategories);

  const [date, setDate] = useState<string>(getCurrentDate());
  const [account, setAccount] = useState<string>(accounts[0]);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [amount, setAmount] = useState<number>(0);

  const submitHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // TO DO: Form error checking
    // if (category === null || allocation === null) {
    //   setError("A field is missing");
    //   return;
    // }

    const dateParts = date.toString().split("-");
    const monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];
    const transaction: Transaction = {
      date: date,
      account: account,
      isMonthly: false,
      name: name,
      category: category as TransactionCategories,
      amount: amount,
    };

    if (data) {
      addTransaction(
        data.uid,
        data.monthTransactionsMap,
        monthAndYear,
        transaction
      );
    }

    setDate(getCurrentDate());
    setAccount(accounts[0]);
    setName("");
    setCategory(categories[0]);
    setAmount(0);
  };

  return (
    <Box>
      <Heading size={"sm"} my="10px">
        Add New Transaction
      </Heading>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Transaction Date</Th>
              <Th>Account</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <FormControl id="transaction-date" isRequired>
                  <Input
                    size="sm"
                    type="date"
                    value={date.toString()}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
              </Td>
              <Td>
                <FormControl id="transaction-account" isRequired>
                  <Select
                    size="sm"
                    value={account}
                    defaultValue={accounts[0]}
                    onChange={(e) => setAccount(e.target.value)}
                  >
                    {accounts.map((account) => {
                      return (
                        <option key={account} value={account}>
                          {account}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Td>
              <Td>
                <FormControl id="transaction-name" isRequired>
                  <Input
                    size="sm"
                    type="text"
                    value={name}
                    placeholder="Transaction name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </Td>
              <Td>
                <FormControl id="transaction-category" isRequired>
                  <Select
                    size="sm"
                    value={category}
                    defaultValue={categories[0]}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category) => {
                      return (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Td>
              <Td isNumeric>
                <FormControl id="transaction-value" isRequired>
                  <Input
                    size="sm"
                    type="number"
                    value={amount}
                    placeholder="125"
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                </FormControl>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Button size="sm" colorScheme="green" onClick={submitHandler}>
        Add transaction
      </Button>
    </Box>
  );
};

function getDisplayDate(dateString: string) {
  const date = new Date(dateString);
  const displayDate = date.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return displayDate;
}

const MonthTransaction = ({
  monthSection,
  data,
  editing,
  deleteTransactionHandler,
}: {
  monthSection: string;
  data: Transaction[];
  editing: boolean;
  deleteTransactionHandler: (
    e: React.MouseEvent<HTMLElement>,
    monthAndYear: string,
    transaction: Transaction
  ) => void;
}) => {
  const dateParts = monthSection.split("-");
  const year = parseInt(dateParts[1]);
  const month = parseInt(dateParts[0]) - 1;
  const sortedTransactions = data.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  return (
    <Box>
      <Heading size={"sm"} my="10px">
        {getMonth(month, year)}
      </Heading>
      <TableContainer>
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
                {editing && (
                  <Button
                    size="xs"
                    colorScheme="linkedin"
                    onClick={(e) =>
                      deleteTransactionHandler(e, monthSection, transaction)
                    }
                  >
                    Delete
                  </Button>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const MonthlyTransactions = ({ userData }: { userData: UserModel }) => {
  const [showAddTransactionsForm, setShowAddTransactionsForm] = useState(false);
  const [editingTransactions, setEditingTransactions] = useState(false);

  if (!userData) return null;
  const transactions = userData.monthTransactionsMap || {};
  const transactionMonths = Object.keys(transactions);
  const sortedTransactionMonths = transactionMonths.sort((a, b) => {
    const date1 = b.split("-");
    const date2 = a.split("-");
    const compareYear = date1[1].localeCompare(date2[1]);
    if (compareYear !== 0) {
      return compareYear;
    }
    return date1[0].localeCompare(date2[0]);
  });

  const deleteTransactionHandler = (
    e: React.MouseEvent<HTMLElement>,
    monthAndYear: string,
    transaction: Transaction
  ) => {
    e.preventDefault();

    if (userData) {
      deleteTransaction(
        userData.uid,
        userData.monthTransactionsMap,
        monthAndYear,
        transaction
      );
    }
  };

  return (
    <Box
      bg={"gray.100"}
      rounded={"5px"}
      p={"20px"}
      width={"100%"}
      border={"1px"}
      borderColor={"gray.300"}
    >
      <HStack justifyContent="space-between">
        <Heading size={"md"}>Monthly Transactions</Heading>
        <Flex gap="8px">
          <Button
            size="sm"
            colorScheme="gray"
            onClick={() => setEditingTransactions(!editingTransactions)}
          >
            {editingTransactions ? "Done Editing" : "Edit"}
          </Button>
          <Button
            size="sm"
            colorScheme="linkedin"
            onClick={() => setShowAddTransactionsForm(!showAddTransactionsForm)}
          >
            {showAddTransactionsForm ? "Hide Form" : "New Transaction"}
          </Button>
        </Flex>
      </HStack>
      {showAddTransactionsForm && <AddTransactionsForm data={userData} />}
      <Box>
        {transactions &&
          sortedTransactionMonths.map((monthSection) => (
            <MonthTransaction
              key={monthSection}
              monthSection={monthSection}
              data={transactions[monthSection]}
              editing={editingTransactions}
              deleteTransactionHandler={deleteTransactionHandler}
            />
          ))}
      </Box>
    </Box>
  );
};

export default MonthlyTransactions;
