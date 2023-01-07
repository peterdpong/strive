import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { useAuth } from "../../src/auth/auth";
import BudgetAllocationModal from "../../components/modals/BudgetAllocationModal";
import { BudgetEngineUtils } from "../../src/engine/BudgetEngineUtils";

// const getRandomColor = () => {
//   const letters = "0123456789ABCDEF".split("");
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

ChartJS.register(ArcElement, Tooltip, Legend);

// Boilerplate data
const data = {
  labels: ["Food", "Entertainment", "Savings", "Unallocated"],
  datasets: [
    {
      label: "$ Dollars",
      data: [123, 23, 34, 45],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  aspectRatio: 2,
};

export default function BudgetPage() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const budgetAllocationModalProps = useDisclosure();

  let balanceAfterFixed = 0;
  let balanceAfterAllocate = 0;
  if (userData) {
    balanceAfterFixed =
      userData?.financialInfo.monthlyIncome -
      BudgetEngineUtils.calculateFixedMonthlyExpenses(
        userData?.financialInfo.monthlyTransactions
      );

    balanceAfterAllocate =
      balanceAfterFixed -
      BudgetEngineUtils.calculateBudgetExpenses(userData?.budgetInfo);
  }

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/finances")}>
          Back
        </Button>
        <Heading>Create a budget</Heading>
        <Text fontSize={"md"}>
          Budget your variable expenses, no need to allocate it all!
        </Text>

        <Container maxW="container.xl" as="form" p={"0px"}>
          <Flex
            bg={"gray.100"}
            rounded={"5px"}
            my={"25px"}
            p={"20px"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <Box flex="2">
              <VStack align="flex-start">
                <Stat>
                  <StatLabel fontSize="xl">
                    Balance for after monthly expenses
                  </StatLabel>
                  <StatNumber fontSize="3xl">${balanceAfterFixed}</StatNumber>
                  <StatLabel fontSize="xl">Balance left to allocate</StatLabel>
                  <StatNumber fontSize="3xl">
                    ${balanceAfterAllocate}
                  </StatNumber>
                </Stat>
              </VStack>
            </Box>
            <Box flex="3">
              <Doughnut data={data} options={options} />
            </Box>
          </Flex>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            my={"25px"}
            p={"20px"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <HStack justifyContent="space-between" my={2}>
              <FormLabel fontSize={"xl"}>Category allocations</FormLabel>
              <Button
                onClick={budgetAllocationModalProps.onOpen}
                colorScheme={"green"}
                size="sm"
              >
                Add a category
              </Button>
            </HStack>
            {userData && Object.keys(userData.budgetInfo.monthlyAllocations) ? (
              <Center
                onClick={budgetAllocationModalProps.onOpen}
                bg={"gray.50"}
                width={"200px"}
                height={"200px"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderStyle={"dashed"}
                borderColor={"gray.300"}
              >
                <Text color={"gray.800"} align={"center"}>
                  Add your monthly allocation for a category
                </Text>
              </Center>
            ) : (
              <></>
            )}
          </Box>

          <Button
            onClick={() => {
              if (userData) {
                // addBudgetInfo(userData.uid, values);
                // console.log(values);
                router.push("/onboarding/goal");
              } else {
                alert("Error: User not logged in...");
                router.push("/login");
              }
            }}
            colorScheme={"green"}
          >
            Next Step
          </Button>
        </Container>
      </Container>

      <BudgetAllocationModal
        isOpen={budgetAllocationModalProps.isOpen}
        onClose={budgetAllocationModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
