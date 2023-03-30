import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
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
  calculateNetWorth,
  goalGraphOptions,
} from "../../src/visualization/GoalVisualizations";
import { useState } from "react";
import { BudgetEngine, GeneratedGoals } from "../../src/engine/BudgetEngine";
import { addUserGoal } from "../../src/firebase/UserActions";

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
  const [netWorthGoal, setNetWorthGoal] = useState<number>(500000);
  const [timelineYears, setTimelineYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<string>("5");
  const [generatedGoals, setGeneratedGoals] = useState<
    GeneratedGoals | undefined | null
  >(undefined);
  // Hardcoded to 1 which is neutral goal (0 - less aggressive, 2 more aggressive)
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number>(1);

  const onGenerateGoals = () => {
    const generateGoalsResult = BudgetEngine.generateGoals(
      userData,
      netWorthGoal,
      timelineYears,
      parseFloat(interestRate)
    );
    setGeneratedGoals(generateGoalsResult);
  };

  const getBankRate = async () => {
    try {
      const res = await fetch(
        "https://www.bankofcanada.ca/valet/observations/V80691311/json?recent=5"
      );
      const data = await res.json();
      setInterestRate(
        data.observations[data.observations.length - 1]["V80691311"].v
      );
      console.log(
        parseFloat(data.observations[data.observations.length - 1]["V80691311"].v)
      );
    } catch {
      console.log("Error getting bank rate");
    }
  };

  const onUpdateGoal = () => {
    if (userData && generatedGoals) {
      if (selectedGoalIndex === 0) {
        addUserGoal(userData.uid, generatedGoals.lessAggressiveGoal);
      } else if (selectedGoalIndex === 1) {
        addUserGoal(userData.uid, generatedGoals.neutralGoal);
      } else {
        addUserGoal(userData.uid, generatedGoals.moreAggressiveGoal);
      }
    }
  };

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
    const netWorthOverTime = [currNetWorth];
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
      //currSpending += userData.budgetInfo.monthlyVariableBudgetUnallocated;

      // add net transactions from the month
      if (currMonth in userData.monthTransactionsMap) {
        currSpending += userData.monthTransactionsMap[currMonth].reduce(
          (netSpending, newTransaction) => {
            return (netSpending += newTransaction.amount);
          },
          0
        );
      }

      console.log(currMonth, currSpending);
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
                Your goal
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
          mx={"24px"}
          my={"2rem"}
        >
          <Heading size={"md"}>Current goal and progress</Heading>
          {graphData !== undefined && graphData !== null ? (
            <Line options={goalGraphOptions} data={graphData} />
          ) : null}
        </Box>

        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <Heading size={"md"} my={"1rem"}>
            Generate and explore other goals
          </Heading>
          <Flex gap="1rem" mb="1">
            <Stack flex={1}>
              <Heading size="md">Savings Goal ($ CAD)</Heading>
              <NumberInput
                min={0}
                defaultValue={netWorthGoal}
                precision={2}
                onChange={(_asString, asNumber) => {
                  setNetWorthGoal(asNumber);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
            <Stack flex={1}>
              <Heading size="md">Timeline Goal in Years</Heading>
              <NumberInput
                min={0}
                defaultValue={timelineYears}
                onChange={(_asString, asNumber) => {
                  setTimelineYears(asNumber);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
            <Stack flex={1}>
              <Heading size="md">Average Rate of Return (%)</Heading>
              <NumberInput
                min={0}
                value={interestRate}
                onChange={(val) => {
                  setInterestRate(val);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button onClick={getBankRate} colorScheme="green">
                Use Canada Prime Rate
              </Button>
            </Stack>
          </Flex>
          <Button onClick={onGenerateGoals} colorScheme="green">
            {generatedGoals === undefined
              ? "Generate Goals"
              : "Regenerate Goals"}
          </Button>

          {generatedGoals === undefined || generatedGoals === null ? null : (
            <Container maxW="container.xl" as="form" p={"0px"}>
              <Box my={"25px"}>
                <SimpleGrid columns={3} spacing={3}>
                  <Card>
                    <CardBody>
                      <Heading size="sm"> Conservative Goal </Heading>
                      <Stat>
                        <StatLabel>Monthly Savings Required</StatLabel>
                        <StatNumber>
                          $
                          {generatedGoals.lessAggressiveGoal.monthlyAmount
                            .toFixed(2)
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                        </StatNumber>
                        <StatLabel>
                          Expected Goal $ Amount in{" "}
                          {generatedGoals.lessAggressiveGoal.timelineGoal}{" "}
                          years:
                        </StatLabel>
                        <StatNumber fontSize="md">
                          $
                          {generatedGoals.lessAggressiveGoal.networthGoal
                            .toFixed(2)
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                        </StatNumber>
                      </Stat>
                      <Button
                        onClick={() => {
                          setSelectedGoalIndex(0);
                        }}
                        isDisabled={selectedGoalIndex === 0 ? true : false}
                        my={"4px"}
                        size={"sm"}
                        colorScheme={"green"}
                      >
                        {selectedGoalIndex === 0 ? "Selected" : "Select"}
                      </Button>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Box>
                        <Heading size="sm">Base Goal</Heading>
                        <Stat>
                          <StatLabel>Monthly Savings Required</StatLabel>
                          <StatNumber>
                            $
                            {generatedGoals.neutralGoal.monthlyAmount
                              .toFixed(2)
                              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                          </StatNumber>
                          <StatLabel>
                            Expected Goal $ Amount in{" "}
                            {generatedGoals.neutralGoal.timelineGoal} years:
                          </StatLabel>
                          <StatNumber fontSize="md">
                            $
                            {generatedGoals.neutralGoal.networthGoal
                              .toFixed(2)
                              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                          </StatNumber>
                        </Stat>
                        <Button
                          onClick={() => {
                            setSelectedGoalIndex(1);
                          }}
                          isDisabled={selectedGoalIndex === 1 ? true : false}
                          my={"4px"}
                          size={"sm"}
                          colorScheme={"green"}
                        >
                          {selectedGoalIndex === 1 ? "Selected" : "Select"}
                        </Button>
                      </Box>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Box>
                        <Heading size="sm"> Aggressive Goal </Heading>
                        <Stat>
                          <StatLabel>Monthly Savings Required</StatLabel>
                          <StatNumber>
                            $
                            {generatedGoals.moreAggressiveGoal.monthlyAmount
                              .toFixed(2)
                              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                          </StatNumber>
                          <StatLabel>
                            Expected Goal $ Amount in{" "}
                            {generatedGoals.moreAggressiveGoal.timelineGoal}{" "}
                            years:
                          </StatLabel>
                          <StatNumber fontSize="md">
                            $
                            {generatedGoals.moreAggressiveGoal.networthGoal
                              .toFixed(2)
                              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                          </StatNumber>
                        </Stat>
                        <Button
                          onClick={() => {
                            setSelectedGoalIndex(2);
                          }}
                          isDisabled={selectedGoalIndex === 2 ? true : false}
                          my={"4px"}
                          size={"sm"}
                          colorScheme={"green"}
                        >
                          {selectedGoalIndex === 2 ? "Selected" : "Select"}
                        </Button>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </Box>

              <Button onClick={onUpdateGoal} colorScheme={"green"}>
                Update goal
              </Button>
            </Container>
          )}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
