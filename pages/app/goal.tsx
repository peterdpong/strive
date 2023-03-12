import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import { useAuth } from "../../src/auth/auth";
import {
  buildGoalGraphData,
  calculateNetWorth,
  goalGraphOptions,
} from "../../src/visualization/GoalVisualizations";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function GoalPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  if (userData === null) {
    return null;
  }

  // graph for net worth goal
  let graphData = buildGoalGraphData({
    userData: userData,
    monthlySavings: userData?.goalInfo.monthlyAmount,
    goalTimeline: userData?.goalInfo.timelineGoal,
  });

  // starting value for current net worth
  let currNetWorth = calculateNetWorth(userData);

  // add up all the transactions for each month
  let netMonthlySpending = Object.keys(userData.monthTransactionsMap).map(
    (month) => {
      return userData.monthTransactionsMap[month].reduce(
        (netSpending, newTransaction) => {
          return (netSpending += newTransaction.amount);
        },
        0
      );
    }
  );

  // construct the array of how net worth changes month-to-month
  // only accounts for unallocated income + transactions
  // no investments are factored into this calculation yet
  let currSpending = currNetWorth;
  let netWorthOverTime = netMonthlySpending.map((spending) => {
    currSpending +=
      spending + userData.budgetInfo.monthlyVariableBudgetUnallocated;
    return currSpending;
  });

  // add current tracked net worth to the graph
  graphData?.datasets.unshift({
    fill: true,
    label: "Current Net Worth",
    data: netWorthOverTime,
    borderColor: "rgb(60, 20, 240)",
    backgroundColor: (context: ScriptableContext<"line">) => {
      const ctx = context.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 500);
      gradient.addColorStop(0, "rgba(140, 80, 240, 1)");
      gradient.addColorStop(1, "rgba(140, 80, 240, 0)");
      return gradient;
    },
  });

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="6" borderRadius="25">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Goal
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <Heading size={"md"}>Current Goal</Heading>
          {graphData !== undefined && graphData !== null ? (
            <Line options={goalGraphOptions} data={graphData} />
          ) : null}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
