import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Transaction } from "../../../src/models/BudgetModel";
import { getMonthFromString } from "../../../src/DateTimeUtils";

const TopExpenses = ({
  transactions,
  monthAndYear,
}: {
  transactions: Transaction[];
  monthAndYear: string;
}) => {
  if (!transactions) return null;

  transactions.sort((a, b) => {
    return b.amount - a.amount;
  });

  const topFiveExpenses = transactions
    .sort((a: Transaction, b: Transaction) => a.amount - b.amount)
    .filter((transaction: Transaction) => transaction.amount < 0)
    .slice(0, 5);

  return (
    <Box
      bg={"gray.100"}
      my={"14px"}
      rounded={"5px"}
      p={"20px"}
      width={"100%"}
      border={"1px"}
      borderColor={"gray.300"}
    >
      <Heading size="md" mb="10px">
        Top expenses in {getMonthFromString(monthAndYear)}
      </Heading>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Expense</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {topFiveExpenses.map((expense, i) => (
            <Tr key={i}>
              <Td>{expense.name}</Td>
              <Td>
                $
                {expense.amount
                  .toFixed(2)
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TopExpenses;
