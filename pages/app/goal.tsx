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

//labels need to be dynamic - port in a list of any size
const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const data_static = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Net Worth",
      //data needs to be dynamic - port in a list of any size
      data: [1, 2, 4, 16, 32, 64, 128, 1, 2, 4, 16, 32],
      borderColor: "rgb(30, 159, 92)",
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, "rgba(45,216,129,1)");
        gradient.addColorStop(1, "rgba(45,216,129,0)");
        return gradient;
      },
    },
  ],
};

export default function GoalPage() {
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
          <Line
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
          />
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
