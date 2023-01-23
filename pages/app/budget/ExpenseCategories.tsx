import { Box, Flex, Heading, Tag, Spacer, HStack } from "@chakra-ui/react";
import { Transaction } from "../../../src/models/BudgetModel";
import { getMonthFromString } from "../../../src/DateTimeUtils";

const tagColors = [
  "#C4EFFE",
  "#FDEEBF",
  "#D5FACE",
  "#FFE7CB",
  "#E1E7FA",
  "#B7FEFF",
];
const colors = [
  "#7795F8",
  "#F69B5A",
  "#3ECF8E",
  "#F97559",
  "#A68CE9",
  "#44B2E8",
];

type CategoryType = {
  name: string;
  amount: number;
};

const ExpenseCategories = ({
  transactions,
  monthlyBudget,
  monthAndYear,
}: {
  transactions: Transaction[];
  monthlyBudget: number;
  monthAndYear: string;
}) => {
  if (!transactions) return null;

  const totalSpent = transactions.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);
  const remainingBudget = monthlyBudget - totalSpent;

  const categories = () => {
    const categoryList: Array<CategoryType> = [];

    transactions.forEach((expense) => {
      for (let i = 0; i < categoryList.length; i++) {
        if (expense.category === categoryList[i].name) {
          categoryList[i].amount += expense.amount;
          return;
        }
      }
      categoryList.push({
        name: expense.category,
        amount: expense.amount,
      });
    });

    return categoryList;
  };

  return (
    <Box rounded={"5px"} p={"0px"} mt="10px">
      <Heading size="md" mb="10px">
        {getMonthFromString(monthAndYear)}
      </Heading>
      <Heading size="xl" my="5px">
        ${totalSpent.toFixed(2)} spent
      </Heading>
      <Heading size="md">${remainingBudget.toFixed(2)} remaining</Heading>
      <Box mt="20px">
        <Flex width="100%" mb="8px">
          <HStack spacing="6px">
            {categories().map((category, i) => (
              <Tag key={i} backgroundColor={tagColors[i]} color={colors[i]}>
                {category.name}
              </Tag>
            ))}
          </HStack>
          <Spacer />
          <Box>
            <Tag backgroundColor="#E7EAF0" color="#8898A9">
              remaining
            </Tag>
          </Box>
        </Flex>
        <Flex
          h="40px"
          w="100%"
          backgroundColor="#E7EAF0"
          borderRadius="5px"
          overflow="hidden"
        >
          {categories().map((category, i) => (
            <Box
              w={`${Math.round((category.amount / monthlyBudget) * 100)}%`}
              h="100%"
              backgroundColor={colors[i]}
              key={i}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ExpenseCategories;
