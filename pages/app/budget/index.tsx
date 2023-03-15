import { Box, Heading, HStack, Select, VStack } from "@chakra-ui/react";
import Sidebar from "../../../components/app/Sidebar";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import ExpenseCategories from "./ExpenseCategories";
import TopExpenses from "./TopExpenses";
import MonthlyTransactions from "./MonthlyTransactions";
import { useAuth } from "../../../src/auth/auth";
import { getCurrentDate, getMonthFromString } from "../../../src/DateTimeUtils";
import { useRouter } from "next/router";

export default function BudgetPage() {
  const router = useRouter();
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const dateParts = getCurrentDate().split("-");
  const monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="6" borderRadius="25">
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

          {/* <Box
            bg={"gray.100"}
            my={"14px"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <Flex>
              <Heading size="lg">56%</Heading>
              <Text>Increase on food from last month</Text>
            </Flex>
          </Box> */}
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
      </Sidebar>
    </ProtectedRoute>
  );
}
