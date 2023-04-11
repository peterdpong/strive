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
  StatLabel,
  StatNumber,
  VStack,
  Flex,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

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
import {
  buildGoalGraphData,
  goalGraphOptions,
} from "../../src/visualization/GoalVisualizations";
import { SuggestionEngine } from "../../src/engine/SuggestionEngine";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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

  // graph for net worth goal
  const graphData = buildGoalGraphData({
    title: "Net Worth Goal",
    userData: userData,
    startingNetWorth: userData?.goalInfo.startingNetWorth,
    monthlySavings: userData?.goalInfo.monthlyAmount,
    goalTimeline: userData?.goalInfo.timelineGoal,
  });

  if (graphData && userData) {
    // find the starting value for current net worth
    const currNetWorth = userData.goalInfo.startingNetWorth;

    // find the month at the start of the goal graph
    let startMonth = "100-100000";
    Object.keys(userData.monthTransactionsMap).forEach((month) => {
      const month1 = startMonth.split("-");
      const month2 = month.split("-");
      if (parseInt(month2[1]) < parseInt(month1[1])) {
        startMonth = month;
      } else if (
        parseInt(month2[1]) === parseInt(month1[1]) &&
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
        monthParts[0] === date.getMonth() + 2 &&
        monthParts[1] === date.getFullYear()
      ) {
        break;
      }

      // add monthly income
      // currSpending += userData.budgetInfo.monthlyVariableBudgetUnallocated;

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
              bg={"gray.100"}
              rounded={"5px"}
              p={"20px"}
              width={"100%"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <HStack justifyContent="space-between" mb={"10px"}>
                <Heading size={"md"}>Suggestions and Alerts</Heading>
                <Button
                  colorScheme={"green"}
                  size="sm"
                  onClick={() => router.push("/app/suggestions")}
                >
                  View all
                </Button>
              </HStack>
              <Accordion allowMultiple>
                {SuggestionEngine.getTopTwoSuggestions(userData)?.map(
                  (suggestion, index) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size={"sm"}>
                              {suggestion.suggestionTitle}
                            </Heading>
                          </Box>
                          <Badge colorScheme={suggestion.badgeColor}>
                            {suggestion.suggestionBadge}
                          </Badge>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {suggestion.suggestionDescription}
                          {suggestion.suggestionActions && (
                            <>
                              <br />
                              <Heading my={"1rem"} size={"sm"}>
                                Suggestions
                              </Heading>
                              <UnorderedList>
                                {suggestion.suggestionActions.map(
                                  (suggestion, index) => (
                                    <ListItem key={index}>
                                      {suggestion}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </>
                          )}
                          {suggestion.source && (
                            <Box my={"1rem"}>
                              <Heading size={"sm"}>
                                Further resources and sources
                              </Heading>
                              {suggestion.source.map((source, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={source.link}
                                    isExternal
                                    color={"blue.300"}
                                  >
                                    {source.linkTitle}
                                    <ExternalLinkIcon mx="2px" />
                                  </Link>
                                );
                              })}
                            </Box>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
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
              <Heading size={"md"}>Goal Progress</Heading>
              {graphData !== undefined && graphData !== null ? (
                <Line options={goalGraphOptions} data={graphData} />
              ) : null}
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
                <Heading size={"md"}>Current Month Category Spending</Heading>
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
