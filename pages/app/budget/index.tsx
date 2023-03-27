import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Sidebar from "../../../components/app/Sidebar";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import ExpenseCategories from "./ExpenseCategories";
import TopExpenses from "./TopExpenses";
import MonthlyTransactions from "./MonthlyTransactions";
import { useAuth } from "../../../src/auth/auth";
import { getCurrentDate, getMonthFromString } from "../../../src/DateTimeUtils";
import { useRouter } from "next/router";
import { Doughnut } from "react-chartjs-2";
import { buildDoughnutGraphData } from "../../../src/visualization/BudgetVisualizationsHelpers";
import { deleteBudgetAllocation } from "../../../src/firebase/UserActions";
import BudgetAllocationModal from "../../../components/modals/BudgetAllocationModal";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { SuggestionEngine } from "../../../src/engine/SuggestionEngine";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetPage() {
  const router = useRouter();
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const dateParts = getCurrentDate().split("-");
  const monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];

  const budgetAllocationModalProps = useDisclosure();
  const onDeleteAllocation = (key: string) => {
    if (
      userData &&
      Object.keys(userData.budgetInfo.monthlyAllocations).includes(key)
    ) {
      deleteBudgetAllocation(
        userData.uid,
        userData.budgetInfo.monthlyAllocations,
        key
      );
      SuggestionEngine.generateAllSpendingBudgetSuggestions(userData);
    }
  };

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
        >
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Budget
              </Heading>
            </VStack>
            <Select
              placeholder={getMonthFromString(monthAndYear)}
              onChange={(event) => {
                if (event.target.value !== monthAndYear) {
                  router.push(`/app/budget/${event.target.value}`);
                }
              }}
            >
              {userData &&
                Object.keys(userData.monthTransactionsMap).map((key) => {
                  if (key !== monthAndYear) {
                    return (
                      <option key={key} value={key}>
                        {getMonthFromString(key)}
                      </option>
                    );
                  }
                })}
            </Select>
          </HStack>
        </Box>
        <Box rounded={"5px"} px={"0px"}></Box>
        <Box p="24px">
          {userData && (
            <ExpenseCategories
              monthlyBudget={parseFloat(
                userData.budgetInfo.monthlyVariableBudget.toString()
              )}
              transactions={userData.monthTransactionsMap[monthAndYear]}
              monthAndYear={monthAndYear}
            />
          )}
          {userData && (
            <TopExpenses
              transactions={userData.monthTransactionsMap[monthAndYear]}
              monthAndYear={monthAndYear}
            />
          )}
          {userData && (
            <MonthlyTransactions
              userData={userData}
              monthAndYear={monthAndYear}
            />
          )}
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
        >
          <Heading size="md">Manage budget allocation</Heading>
          <Flex>
            <Box flex="2">
              <VStack align="flex-start">
                <Stat>
                  <StatLabel fontSize="xl">
                    Monthly Income before Expenses
                  </StatLabel>
                  <StatNumber fontSize="2xl">
                    $
                    {userData &&
                      (
                        userData.financialInfo.annualIncome *
                        userData.financialInfo.payfreq
                      )
                        .toFixed(2)
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </StatNumber>
                  <StatLabel fontSize="xl">Expenses</StatLabel>
                  <StatNumber fontSize="2xl">
                    $
                    {userData &&
                      (
                        userData.financialInfo.annualIncome *
                          userData.financialInfo.payfreq -
                        userData.budgetInfo.monthlyVariableBudgetUnallocated
                      )
                        .toFixed(2)
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </StatNumber>
                  <StatLabel fontSize="xl">
                    Monthly Income after Expenses
                  </StatLabel>
                  <StatNumber fontSize="2xl">
                    $
                    {userData?.budgetInfo.monthlyVariableBudgetUnallocated
                      .toFixed(2)
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </StatNumber>
                </Stat>
              </VStack>
            </Box>
            <Box flex="3">
              {userData && (
                <Doughnut
                  data={buildDoughnutGraphData(userData.budgetInfo)}
                  options={{
                    aspectRatio: 3,
                  }}
                />
              )}
            </Box>
          </Flex>
          <HStack justifyContent="space-between" my={2}>
            <FormLabel fontSize={"xl"}>Expense Categories</FormLabel>
            <Button
              onClick={budgetAllocationModalProps.onOpen}
              colorScheme={"green"}
              size="sm"
            >
              Add a category
            </Button>
          </HStack>

          {userData &&
          Object.keys(userData.budgetInfo.monthlyAllocations).length === 0 ? (
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
            <SimpleGrid
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
              {userData &&
                Object.keys(userData.budgetInfo.monthlyAllocations).map(
                  (key) => {
                    const currentCategory =
                      userData.budgetInfo.monthlyAllocations[key];

                    return (
                      <Card bgColor={"white"} key={key} justify="space-between">
                        <CardBody>
                          <Heading color={currentCategory.color} size="sm">
                            {key}
                          </Heading>
                          <Stat>
                            <StatLabel>Expense Category</StatLabel>
                            <StatNumber>
                              $
                              {currentCategory.allocation
                                .toFixed(2)
                                .replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}
                            </StatNumber>
                          </Stat>
                        </CardBody>
                        <CardFooter>
                          <Button
                            onClick={() => {
                              onDeleteAllocation(key);
                            }}
                            size="xs"
                            variant="link"
                          >
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  }
                )}
            </SimpleGrid>
          )}
        </Box>
      </Sidebar>

      <BudgetAllocationModal
        isOpen={budgetAllocationModalProps.isOpen}
        onClose={budgetAllocationModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
