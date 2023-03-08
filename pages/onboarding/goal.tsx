import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  Portal,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  ChartData,
  ScatterDataPoint,
} from "chart.js";
import { Flex, Stack } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { addUserGoal } from "../../src/firebase/UserActions";
import { useAuth } from "../../src/auth/auth";
import { BudgetEngine, GeneratedGoals } from "../../src/engine/BudgetEngine";
import {
  buildGoalGraphData,
  goalGraphOptions,
} from "../../src/visualization/GoalVisualizations";

// Boilerplate data
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Legend
);

export default function SuggestionsPage() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const [netWorthGoal, setNetWorthGoal] = useState<number>(500000);
  const [timelineYears, setTimelineYears] = useState<number>(20);
  const [goals, setGoals] = useState<GeneratedGoals | undefined | null>(
    undefined
  );

  // Hardcoded to 1 which is neutral goal (0 - less aggressive, 2 more aggressive)
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number>(1);
  const [graphData, setGraphData] = useState<ChartData<
    "line",
    (number | ScatterDataPoint | null)[],
    unknown
  > | null>(null);

  const onGenerateGoals = () => {
    const generateGoalsResult = BudgetEngine.generateGoals(
      userData,
      netWorthGoal,
      timelineYears
    );
    setGoals(generateGoalsResult);
    setGraphData(
      buildGoalGraphData({
        userData: userData,
        monthlySavings: generateGoalsResult?.neutralGoal.monthlyAmount,
        goalTimeline: generateGoalsResult?.neutralGoal.timelineGoal,
      })
    );
  };

  const onSelectGoal = (goalIndex: number) => {
    setSelectedGoalIndex(goalIndex);

    // Super spaghetti code but im too lazy to figure out a better way rn (peter)
    if (goalIndex === 0) {
      setGraphData(
        buildGoalGraphData({
          userData: userData,
          monthlySavings: goals?.lessAggressiveGoal.monthlyAmount,
          goalTimeline: goals?.lessAggressiveGoal.timelineGoal,
        })
      );
    } else if (goalIndex === 1) {
      setGraphData(
        buildGoalGraphData({
          userData: userData,
          monthlySavings: goals?.neutralGoal.monthlyAmount,
          goalTimeline: goals?.neutralGoal.timelineGoal,
        })
      );
    } else {
      setGraphData(
        buildGoalGraphData({
          userData: userData,
          monthlySavings: goals?.moreAggressiveGoal.monthlyAmount,
          goalTimeline: goals?.moreAggressiveGoal.timelineGoal,
        })
      );
    }
  };

  const onFinish = () => {
    if (userData && goals) {
      if (selectedGoalIndex === 0) {
        addUserGoal(userData.uid, goals.lessAggressiveGoal);
      } else if (selectedGoalIndex === 1) {
        addUserGoal(userData.uid, goals.neutralGoal);
      } else {
        addUserGoal(userData.uid, goals.moreAggressiveGoal);
      }

      router.push("/app");
    } else {
      alert("Error: User not logged in...");
      router.push("/login");
    }
  };

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/budget")}>
          Back
        </Button>
        <Heading>Choose your goal</Heading>
        <Text fontSize={"md"}>Choose your net worth and timeline goals.</Text>
        <Box
          bg={"gray.100"}
          rounded={"5px"}
          my={"25px"}
          p={"20px"}
          border={"1px"}
          borderColor={"gray.300"}
        >
          <Flex gap="1rem" mb="1">
            <Stack flex={1}>
              <Heading size="md">Net Worth Goal ($)</Heading>
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
          </Flex>
          <Button onClick={onGenerateGoals} colorScheme="green">
            {goals === undefined ? "Generate Goals" : "Regenerate Goals"}
          </Button>
        </Box>

        {goals === null ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>
              Set net worth goal and timeline not feasible
            </AlertTitle>
            <AlertDescription>
              Goal is not possible given financial information.
            </AlertDescription>
          </Alert>
        ) : null}

        {goals === undefined || goals === null ? null : (
          // <Formik
          //   initialValues={{
          //     selectedGoalIndex: 1, // 1 is the neutral aggresiveness
          //   }}
          //   onSubmit={(values, actions) => {
          //     if (userData) {
          //       // if (
          //       //   values.selectedGoalInfo &&
          //       //   getUserGoal(userData.uid) !== values.selectedGoalInfo
          //       // ) {
          //       //   addUserGoal(userData.uid, values.selectedGoalInfo);
          //       // }
          //       actions.resetForm;
          //       console.log(values);
          //       router.push("/app");
          //     } else {
          //       alert("Error: User not logged in...");
          //       router.push("/login");
          //     }
          //   }}
          // >
          //   {({ handleSubmit }) => (

          //   )}
          // </Formik>
          <Container maxW="container.xl" as="form" p={"0px"}>
            <Heading fontSize={"xl"}>Select a suggested goal</Heading>
            <Popover closeOnBlur={false} placement="bottom">
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button colorScheme={"green"}>
                      {isOpen ? "Close" : "More information"}
                    </Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverHeader>Calculation details</PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Box>
                          The three goals below take into account your inputted
                          information and use an assumed 5% rate-of-return
                          assumption, which encompasses a diversified portfolio
                          and current economic conditions.
                        </Box>
                      </PopoverBody>
                      <PopoverFooter>Citations: TBD</PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </>
              )}
            </Popover>

            <Box
              bg={"gray.100"}
              rounded={"5px"}
              my={"25px"}
              p={"20px"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <SimpleGrid columns={3} spacing={3}>
                <Card>
                  <CardBody>
                    <Heading size="sm"> Conservative Goal </Heading>
                    <Stat>
                      <StatLabel>Monthly Savings</StatLabel>
                      <StatNumber>
                        ${goals.lessAggressiveGoal.monthlyAmount.toFixed(2)}
                      </StatNumber>
                      <StatLabel>
                        Net Worth Goal in{" "}
                        {goals.lessAggressiveGoal.timelineGoal} years
                      </StatLabel>
                      <StatNumber fontSize="md">
                        ${goals.lessAggressiveGoal.networthGoal.toFixed(2)}
                      </StatNumber>
                    </Stat>
                    <Button
                      onClick={() => {
                        onSelectGoal(0);
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
                        <StatLabel>Monthly Savings</StatLabel>
                        <StatNumber>
                          ${goals.neutralGoal.monthlyAmount.toFixed(2)}
                        </StatNumber>
                        <StatLabel>
                          Net Worth Goal in {goals.neutralGoal.timelineGoal}{" "}
                          years
                        </StatLabel>
                        <StatNumber fontSize="md">
                          ${goals.neutralGoal.networthGoal.toFixed(2)}
                        </StatNumber>
                      </Stat>
                      <Button
                        onClick={() => {
                          onSelectGoal(1);
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
                        <StatLabel>Monthly Savings</StatLabel>
                        <StatNumber>
                          ${goals.moreAggressiveGoal.monthlyAmount.toFixed(2)}
                        </StatNumber>
                        <StatLabel>
                          Net Worth Goal in{" "}
                          {goals.moreAggressiveGoal.timelineGoal} years
                        </StatLabel>
                        <StatNumber fontSize="md">
                          ${goals.moreAggressiveGoal.networthGoal.toFixed(2)}
                        </StatNumber>
                      </Stat>
                      <Button
                        onClick={() => {
                          onSelectGoal(2);
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
            <Box
              bg={"gray.100"}
              rounded={"5px"}
              my={"25px"}
              p={"20px"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              <Heading mb={"8px"} fontSize={"xl"}>
                Overview of Selected Goal
              </Heading>
              {graphData !== undefined && graphData !== null ? (
                <Line options={goalGraphOptions} data={graphData} />
              ) : null}
            </Box>

            <Button onClick={onFinish} colorScheme={"green"}>
              Finish
            </Button>
          </Container>
        )}
      </Container>
    </ProtectedRoute>
  );
}
