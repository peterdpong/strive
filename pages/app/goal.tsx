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

  let graphData = buildGoalGraphData({
    userData: userData,
    monthlySavings: userData?.goalInfo.monthlyAmount,
    goalTimeline: userData?.goalInfo.timelineGoal,
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
          {/* <Line
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Path to Goal",
                },
              },
            }}
            data={data_static}
          /> */}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
