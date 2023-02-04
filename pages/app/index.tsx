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

// Boilerplate data
const labels = [
  "Groceries",
  "Transportation",
  "Entertainment",
  "Rent",
  "Travel",
  "Gifts",
];
const horizontalOptions = {
  indexAxis: "y" as const,
  responsive: true,
  borderRadius: 100,
};
const data = {
  labels: labels,
  datasets: [
    {
      label: "Categories",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      borderWidth: 1,
    },
  ],
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
              <HStack>
                <Heading size={"md"}>Your Goal</Heading>
                <Button
                  colorScheme={"green"}
                  onClick={() => router.push("app/goal")}
                  size="xs"
                >
                  Explore goal
                </Button>
              </HStack>
              <Divider my={1} />
              <HStack justifyContent="space-between" align="flex-start">
                <VStack align="flex-start">
                  <Heading size="md">Long-term goal</Heading>
                  <Stat>
                    <StatLabel fontSize="xl">Net Worth</StatLabel>
                    <StatNumber fontSize="3xl">$123.56</StatNumber>
                    <StatHelpText fontSize="lg">
                      <CheckIcon mr={2} />
                      On track
                    </StatHelpText>
                  </Stat>
                </VStack>
                <VStack align="flex-start">
                  <Heading size="md">Monthly goal</Heading>
                  <Stat>
                    <StatLabel fontSize="xl">Lower food spending</StatLabel>
                    <StatNumber fontSize="3xl">$123.56</StatNumber>
                    <StatHelpText fontSize="lg">
                      <CheckIcon mr={2} />
                      On track
                    </StatHelpText>
                  </Stat>
                </VStack>

                <Box>
                  <HStack>
                    <Heading size="md">Goal Information</Heading>
                    <Button size="sm" variant="outline">
                      Adjust goals
                    </Button>
                  </HStack>

                  <Text>Net worth of $xxxx in x years</Text>
                  <Text>Savings of $xxxx per month</Text>
                  <Text>Net worth of $xxxx saving $xxxx per month</Text>
                  <Text>x years and x months to reach goal</Text>
                </Box>
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
              <Heading size={"md"}>Net Worth</Heading>
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
              <Bar data={data} options={horizontalOptions} />
            </Box>
          </VStack>
        </Flex>
      </Sidebar>
    </ProtectedRoute>
  );
}
