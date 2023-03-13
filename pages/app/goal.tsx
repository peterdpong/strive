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
  const graphData = buildGoalGraphData({
    title: "Net Worth Goal",
    userData: userData,
    monthlySavings: userData?.goalInfo.monthlyAmount,
    goalTimeline: userData?.goalInfo.timelineGoal,
  });

  if (graphData) {
    // find the starting value for current net worth
    const currNetWorth = calculateNetWorth(userData);
    console.log(userData.monthTransactionsMap);

    // find the month at the start of the goal graph
    let startMonth = "100-100000";
    Object.keys(userData.monthTransactionsMap).forEach((month) => {
      const month1 = startMonth.split("-");
      const month2 = month.split("-");
      if (
        parseInt(month2[1]) < parseInt(month1[1]) &&
        parseInt(month2[0]) < parseInt(month1[0])
      ) {
        startMonth = month;
      }
    });

    // construct the array of how net worth changes month-to-month
    // only accounts for unallocated income + transactions
    // no investments are factored into this calculation yet
    const netWorthOverTime = [];
    let currMonth = startMonth;
    let currSpending = currNetWorth;
    for (let i = 0; i < graphData.datasets[0].data.length; i++) {
      // if graph month is in the future, stop recording net worth
      const monthParts = currMonth.split("-").map((part) => parseInt(part));
      const date = new Date(); // current date
      if (
        monthParts[0] === date.getMonth() + 1 &&
        monthParts[1] === date.getFullYear()
      ) {
        break;
      }

      // add monthly income
      currSpending += userData.budgetInfo.monthlyVariableBudgetUnallocated;

      // add net transactions from the month
      if (currMonth in userData.monthTransactionsMap) {
        currSpending += userData.monthTransactionsMap[currMonth].reduce(
          (netSpending, newTransaction) => {
            return (netSpending += newTransaction.amount);
          },
          0
        );
      }

      netWorthOverTime.push(currSpending);

      // increase currMonth
      if (monthParts[0] === 12) {
        monthParts[0] = 1;
        monthParts[1] += 1;
      } else {
        monthParts[0] += 1;
      }
      currMonth = monthParts.join("-");
    }

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
  }

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
