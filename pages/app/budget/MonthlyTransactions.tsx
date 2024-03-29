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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
import { getCurrentDate, getMonthFromString } from "../../../src/DateTimeUtils";
import { SuggestionEngine } from "../../../src/engine/SuggestionEngine";

const AddTransactionsForm = ({ data }: { data: UserModel }) => {
  const dataAccounts = data.financialInfo.accounts;
  const accounts = [
    ...Object.keys(dataAccounts.bankAccounts),
    ...Object.keys(dataAccounts.creditCards),
    ...Object.keys(dataAccounts.loans),
  ];
  const categories = Object.values(TransactionCategories);

  const [date, setDate] = useState<string>(getCurrentDate());
  const [account, setAccount] = useState<string>(accounts[0]);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [amount, setAmount] = useState<string>("");

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
      amount: parseFloat(amount),
    };

    if (data) {
      addTransaction(
        data.uid,
        data.monthTransactionsMap,
        data.financialInfo.accounts,
        monthAndYear,
        transaction
      );
      SuggestionEngine.generateAllSpendingBudgetSuggestions(data);
    }

    setDate(getCurrentDate());
    setAccount(accounts[0]);
    setName("");
    setCategory(categories[0]);
    setAmount("");
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
                  <NumberInput
                    size={"sm"}
                    value={amount ? amount : ""}
                    onChange={(e) => setAmount(e)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
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
  const sortedTransactions = data.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  return (
    <Box>
      <Heading size={"sm"} my="10px">
        {getMonthFromString(monthSection)}
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
                  $
                  {parseFloat(transaction.amount.toString())
                    .toFixed(2)
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                </Td>
                {editing && (
                  <Button
                    size="xs"
                    colorScheme="green"
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

const MonthlyTransactions = ({
  userData,
  monthAndYear,
}: {
  userData: UserModel;
  monthAndYear: string;
}) => {
  const [showAddTransactionsForm, setShowAddTransactionsForm] = useState(false);
  const [editingTransactions, setEditingTransactions] = useState(false);

  if (!userData) return null;
  const transactions = userData.monthTransactionsMap || {};

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
        userData.financialInfo.accounts,
        monthAndYear,
        transaction
      );
      SuggestionEngine.generateAllSpendingBudgetSuggestions(userData);
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
            {editingTransactions ? "Done editing" : "Edit"}
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => setShowAddTransactionsForm(!showAddTransactionsForm)}
          >
            {showAddTransactionsForm ? "Hide Form" : "New transaction"}
          </Button>
        </Flex>
      </HStack>
      {showAddTransactionsForm && <AddTransactionsForm data={userData} />}
      <Box>
        <MonthTransaction
          key={monthAndYear}
          monthSection={monthAndYear}
          data={transactions[monthAndYear]}
          editing={editingTransactions}
          deleteTransactionHandler={deleteTransactionHandler}
        />
      </Box>
    </Box>
  );
};

export default MonthlyTransactions;
