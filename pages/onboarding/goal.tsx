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
} from "@chakra-ui/react";
import { Formik } from "formik";
import { SubmitButton } from "formik-chakra-ui";
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
  ScriptableContext,
} from "chart.js";
import { Flex, Stack } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
//import { addUserGoal, getUserGoal } from "../../src/firebase/UserActions";
import { useAuth } from "../../src/auth/auth";
import { BudgetEngine } from "../../src/engine/BudgetEngine";

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

const options = {
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
};

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

const data = {
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
export default function SuggestionsPage() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const [netWorthGoal, setNetWorthGoal] = useState<number>(500000);
  const [timelineYears, setTimelineYears] = useState<number>(20);

  const [goals, setGoals] = useState<string | 0 | undefined>(undefined);

  const onGenerateGoals = () => {
    const generateGoalsResult = BudgetEngine.generateGoals(
      userData,
      netWorthGoal,
      timelineYears
    );
    setGoals(generateGoalsResult);
    console.log(generateGoalsResult);
  };

  // const [sliderValue, setSliderValue] = useState(500000);
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [sliderValueTimeline, setSliderValueTimeline] = useState(40);
  // const [showTooltipTimeline, setShowTooltipTimeline] = useState(false);

  //console.log(BudgetEngine.generateGoals(userData, 100000, 10));

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/budget")}>
          Back
        </Button>
        <Heading>Choose your goal</Heading>
        <Text fontSize={"md"}>Choose your net worth and timeline goal.</Text>
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
              <Heading size="md">Timeline Goal in years</Heading>
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

        {goals === undefined ? null : <>hello</>}

        <Formik
          initialValues={{
            selectedGoalIndex: 1, // 1 is the neutral aggresiveness
          }}
          onSubmit={(values, actions) => {
            if (userData) {
              // if (
              //   values.selectedGoalInfo &&
              //   getUserGoal(userData.uid) !== values.selectedGoalInfo
              // ) {
              //   addUserGoal(userData.uid, values.selectedGoalInfo);
              // }
              actions.resetForm;
              console.log(values);
              router.push("/app");
            } else {
              alert("Error: User not logged in...");
              router.push("/login");
            }
          }}
        >
          {({ handleSubmit }) => (
            <Container
              maxW="container.xl"
              as="form"
              p={"0px"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSubmit={handleSubmit as any}
            >
              <Heading fontSize={"xl"}>Selected a suggested goals</Heading>

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
                      <Heading size="sm"> Passive Goal </Heading>
                      <Stat>
                        <StatLabel>Monthly Savings</StatLabel>
                        <StatNumber>$250</StatNumber>
                        <StatLabel>Net Worth Goal in 5 years</StatLabel>
                        <StatNumber fontSize="md">$50,000</StatNumber>
                      </Stat>
                      <Button my={"4px"} size={"sm"} colorScheme={"green"}>
                        Select
                      </Button>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Box>
                        <Heading size="sm">Neutral Goal</Heading>
                        <Stat>
                          <StatLabel>Monthly Savings</StatLabel>
                          <StatNumber>$500</StatNumber>
                          <StatLabel>Net Worth Goal in 5 years</StatLabel>
                          <StatNumber fontSize="md">$65,000</StatNumber>
                        </Stat>
                        <Button
                          isDisabled
                          my={"4px"}
                          size={"sm"}
                          colorScheme={"green"}
                        >
                          Selected
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
                          <StatNumber>$1000</StatNumber>
                          <StatLabel>Net Worth Goal in 5 years</StatLabel>
                          <StatNumber fontSize="md">$85,000</StatNumber>
                        </Stat>
                        <Button my={"4px"} size={"sm"} colorScheme={"green"}>
                          Select
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
                  Overview of selected goal
                </Heading>
                <Line options={options} data={data} />
              </Box>

              <SubmitButton colorScheme={"green"}>Finish</SubmitButton>
            </Container>
          )}
        </Formik>
      </Container>
    </ProtectedRoute>
  );
}
