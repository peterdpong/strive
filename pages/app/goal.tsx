import {
  Box,
  Divider,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
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
  goalGraphOptions,
  getGoalProgressGraphData,
} from "../../src/visualization/GoalVisualizations";
import { BudgetEngineUtils } from "../../src/engine/BudgetEngineUtils";

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
    const netWorthOverTime = getGoalProgressGraphData(userData, graphData);
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
          bg={"gray.100"}
          rounded={"5px"}
          p={"20px"}
          my={"2rem"}
          mx={"15px"}
          border={"1px"}
          borderColor={"gray.300"}
        >
          <HStack justifyContent="space-between" mb={"10px"}>
            <Heading size={"md"}>Goal Overview</Heading>
          </HStack>
          <Divider my={1} />
          <HStack justifyContent="space-around" mb="1rem" align="flex-start">
            <VStack align="flex-start">
              <Stat>
                <StatLabel fontSize="xl">Current Net Worth</StatLabel>
                <StatNumber fontSize="2xl">
                  {userData
                    ? `$${BudgetEngineUtils.calculateNetWorth(
                        userData.financialInfo.accounts
                      )
                        .toFixed(2)
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`
                    : "Error"}
                </StatNumber>
              </Stat>
            </VStack>
            <VStack align="flex-start">
              <Stat>
                <StatLabel fontSize="xl">Current Month Savings</StatLabel>
                <StatNumber fontSize="2xl">
                  {userData
                    ? `$${BudgetEngineUtils.calculateCurrentMonthSavings(
                        userData
                      )
                        .toFixed(2)
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`
                    : "Error"}
                </StatNumber>
              </Stat>
            </VStack>
          </HStack>
          <Divider my={1} />
          <HStack justifyContent="space-between" align="flex-start">
            <VStack align="flex-start">
              <Stat>
                <StatLabel fontSize="xl">Savings Goal</StatLabel>
                <StatNumber fontSize="2xl">
                  $
                  {userData?.goalInfo.networthGoal
                    .toFixed(2)
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                </StatNumber>
              </Stat>
            </VStack>
            <VStack align="flex-start">
              <Stat>
                <StatLabel fontSize="xl">Target Monthly Savings</StatLabel>
                <StatNumber fontSize="2xl">
                  $
                  {userData?.goalInfo.monthlyAmount
                    .toFixed(2)
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                </StatNumber>
              </Stat>
            </VStack>

            <VStack align="flex-start">
              <Stat>
                <StatLabel fontSize="xl">Goal Timeline</StatLabel>
                <StatNumber fontSize="2xl">
                  {userData?.goalInfo.timelineGoal} years
                </StatNumber>
              </Stat>
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
          <Heading size={"md"}>Current Goal Progress</Heading>
          {graphData !== undefined && graphData !== null ? (
            <Line options={goalGraphOptions} data={graphData} />
          ) : null}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
