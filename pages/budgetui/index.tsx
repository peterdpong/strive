import {
  Box,
  Container,
  Flex,
  Heading,
  Tag,
  Text,
  Spacer,
  HStack,
} from "@chakra-ui/react";

const expenses = [
  {
    description: "University of Toronto",
    amount: 8519,
    category: "tuition",
  },
  {
    description: "Apple Inc.",
    amount: 2349,
    category: "electronics",
  },
  {
    description: "Feely's Autoshop",
    amount: 130,
    category: "other",
  },
  {
    description: "Gong Cha",
    amount: 87,
    category: "food",
  },
  {
    description: "Cheese",
    amount: 12,
    category: "food",
  },
];

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

export default function BudgetUI() {
  const monthlyBudget = 12000;
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  const categories = () => {
    let categoryList: Array<CategoryType> = [];

    expenses.forEach((expense) => {
      for (var i = 0; i < categoryList.length; i++) {
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
    <Box>
      <Container maxW="container.md" rounded={"5px"} px={"0px"} mt="60px">
        <Heading size="md">May</Heading>
        <Heading size="xl">${totalSpent} spent</Heading>
        <Heading size="md">${monthlyBudget - totalSpent} remaining</Heading>
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
              ></Box>
            ))}
          </Flex>
        </Box>
      </Container>

      <Container
        bg={"gray.300"}
        maxW="container.md"
        rounded={"5px"}
        my={"25px"}
        p={"25px"}
      >
        <Flex>
          <Heading size="lg">56%</Heading>
          <Text>Increase on food from last month</Text>
        </Flex>
      </Container>
      <Container
        bg={"gray.300"}
        maxW="container.md"
        rounded={"5px"}
        my={"25px"}
        p={"25px"}
      >
        <Heading size="md">Top expenses this month</Heading>
        <Box width="100%">
          {expenses.map((expense, i) => (
            <HStack key={i} width="100%">
              <Text>{expense.description}</Text>
              <Text>${expense.amount}</Text>
            </HStack>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
