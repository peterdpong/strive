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
} from "@chakra-ui/react";
import { Transaction } from "../../../src/models/BudgetModel";
import { getMonth } from "./utils";

const TopExpenses = ({ transactions }: { transactions: Transaction[] }) => {
  transactions.sort((a, b) => {
    return b.amount - a.amount;
  });

  const topFiveExpenses = transactions.slice(0, 5);

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
        Top expenses in {getMonth()}
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
              <Td>${expense.amount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TopExpenses;
