import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { useRouter } from "next/router";
import { Bar, Line } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import MonthlyTransactions from "./budget/MonthlyTransactions";
import { useAuth } from "../../src/auth/auth";
import { getCurrentDate } from "../../src/DateTimeUtils";
import { buildBudgetCategoryBarGraphData } from "../../src/visualization/BudgetVisualizationsHelpers";
import { BudgetEngineUtils } from "../../src/engine/BudgetEngineUtils";

const horizontalOptions = {
  indexAxis: "y" as const,
  responsive: true,
  borderRadius: 100,
  plugins: {
    legend: {
      display: false,
    },
  },
  options: {
    scales: {
      y: {
        stacked: true,
      },
      x: {
        beginAtZero: true,
      },
    },
  },
};

const dataLine = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      fill: true,
      label: "Net Worth",
      data: [1, 2, 4, 16, 32, 64, 128],
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

export default function Dashboard() {
  const router = useRouter();
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const dateParts = getCurrentDate().split("-");
  const monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
        >
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Dashboard
              </Heading>
            </VStack>
          </HStack>
        </Box>

        <Flex my={"25px"}>
          {/* Dashboard Column 1 */}
          <VStack flex={1} mx={"15px"} spacing={"25px"}>
            <Box
              bg={"gray.100"}
              rounded={"5px"}
              p={"20px"}
              width={"100%"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <HStack justifyContent="space-between" mb={"10px"}>
                <Heading size={"md"}>Goal Overview</Heading>
                <HStack spacing={"5px"}>
                  <Button
                    colorScheme={"green"}
                    onClick={() => router.push("app/goal")}
                    size="sm"
                  >
                    Explore goal
                  </Button>
                </HStack>
              </HStack>
              <Divider my={1} />
              <HStack
                justifyContent="space-around"
                mb="1rem"
                align="flex-start"
              >
                <VStack align="flex-start">
                  <Stat>
                    <StatLabel fontSize="xl">Current Net Worth</StatLabel>
                    <StatNumber fontSize="2xl">
                      {userData
                        ? `$${BudgetEngineUtils.calculateNetWorth(
                            userData.financialInfo.accounts
                          ).toFixed(2)}`
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
                          ).toFixed(2)}`
                        : "Error"}
                    </StatNumber>
                  </Stat>
                </VStack>
              </HStack>
              <Divider my={1} />
              <HStack justifyContent="space-between" align="flex-start">
                <VStack align="flex-start">
                  <Stat>
                    <StatLabel fontSize="xl">Net Worth Goal</StatLabel>
                    <StatNumber fontSize="2xl">
                      ${userData?.goalInfo.networthGoal}
                    </StatNumber>
                  </Stat>
                </VStack>
                <VStack align="flex-start">
                  <Stat>
                    <StatLabel fontSize="xl">Monthly savings target</StatLabel>
                    <StatNumber fontSize="2xl">
                      ${userData?.goalInfo.monthlyAmount.toFixed(2)}
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
              bg={"gray.100"}
              rounded={"5px"}
              p={"20px"}
              width={"100%"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <HStack justifyContent="space-between" mb={"10px"}>
                <Heading size={"md"}>Suggestions and Alerts</Heading>
                <Button colorScheme={"green"} size="sm">
                  View all
                </Button>
              </HStack>
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Unused TFSA Room
                      </Box>
                      <Badge colorScheme="green">Savings opportunity</Badge>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Spending on entertainment 15% greater than last month
                      </Box>
                      <Badge colorScheme="red">Increased spending</Badge>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>

            {/* Monthly transactions */}
            {userData && (
              <MonthlyTransactions
                userData={userData}
                monthAndYear={monthAndYear}
              />
            )}
          </VStack>
          {/* Dashboard Column 2 */}
          <VStack flex={1} mx={"15px"} spacing={"25px"}>
            <Box
              bg={"gray.100"}
              rounded={"5px"}
              p={"20px"}
              width={"100%"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <HStack justifyContent="space-between" mb={"10px"}>
                <Heading size={"md"}>Net Worth</Heading>
                <Button
                  colorScheme={"green"}
                  onClick={() => router.push("onboarding/goal")}
                  size="sm"
                >
                  Adjust net worth goal
                </Button>
              </HStack>
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
                data={dataLine}
              />
            </Box>
            <Box
              bg={"gray.100"}
              rounded={"5px"}
              p={"20px"}
              width={"100%"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <HStack my={2} justifyContent="space-between">
                <Heading size={"md"}>Your budget categories</Heading>
                <Button
                  onClick={() => router.push("/app/budget")}
                  size="sm"
                  colorScheme="green"
                >
                  View budget
                </Button>
              </HStack>
              {userData && (
                <Bar
                  data={buildBudgetCategoryBarGraphData(userData)}
                  options={horizontalOptions}
                />
              )}
            </Box>
          </VStack>
        </Flex>
      </Sidebar>
    </ProtectedRoute>
  );
}
