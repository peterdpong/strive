import {
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ProtectedPage from "../../components/ProtectedPage";
import { useAuth } from "reactfire";
import { addUserGoal, getUserGoal } from "../../src/firebase/UserActions";

ChartJS.register(ArcElement, Tooltip, Legend);

// Boilerplate data
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
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
export default function SuggestionsPage() {
  const router = useRouter();
  const auth = useAuth();

  return (
    <ProtectedPage whenSignedOut="login">
      <Formik
        initialValues={{
          selectedGoalInfo: auth.currentUser
            ? getUserGoal(auth.currentUser.uid)
            : null,
        }}
        onSubmit={(values, actions) => {
          if (auth.currentUser) {
            if (
              values.selectedGoalInfo &&
              getUserGoal(auth.currentUser.uid) !== values.selectedGoalInfo
            ) {
              addUserGoal(auth.currentUser.uid, values.selectedGoalInfo);
            }
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
            bg={"gray.300"}
            maxW="container.lg"
            rounded={"5px"}
            my={"25px"}
            p={"25px"}
            as="form"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={handleSubmit as any}
          >
            <Button
              size="sm"
              onClick={() => router.push("/onboarding/variablebudget")}
            >
              Back
            </Button>

            <Heading>Your budget overview</Heading>

            <Text>Adjust your budget and see alternatives</Text>
            <Box>
              <Line options={options} data={data} />
            </Box>

            <Divider borderColor={"currentcolor"} my={2} />

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>Your Goal</FormLabel>
                <Button size="sm">Edit</Button>
              </HStack>
              <Box>
                <Text>Net worth of $xxxx in x years</Text>
                <Text>Savings of $xxxx per month</Text>
                <Text>Net worth of $xxxx saving $xxxx per month</Text>
                <Text>x years and x months to reach goal</Text>
              </Box>
              <Divider borderColor={"currentcolor"} my={2} />
            </Box>

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>Your Finances</FormLabel>
                <Button size="sm">Edit</Button>
              </HStack>

              <VStack align="flex-start">
                <Stat>
                  <StatLabel fontSize="xl">Monthly income</StatLabel>
                  <StatNumber fontSize="2xl">$123.56</StatNumber>
                </Stat>
              </VStack>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>
                  Fixed Monthly Transactions
                </FormLabel>
              </HStack>

              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Category</Th>
                      <Th>Name</Th>
                      <Th isNumeric>Amount per month</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Credit Card</Td>
                      <Td>Payment</Td>
                      <Td isNumeric>-$15.32</Td>
                    </Tr>
                    <Tr>
                      <Td>Savings account</Td>
                      <Td>Deposit</Td>
                      <Td isNumeric>+$30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>Student Loan</Td>
                      <Td>Monthly Student Loan Payment</Td>
                      <Td isNumeric>-$200</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <Divider borderColor={"currentcolor"} my={2} />
            </Box>

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>Your Monthly Allocations</FormLabel>
                <Button size="sm">Edit</Button>
              </HStack>
              <Stat>
                <StatLabel fontSize="xl">Remaining monthly budget</StatLabel>
                <StatNumber fontSize="2xl">$123.56</StatNumber>
              </Stat>
              <Box>
                <FormLabel fontSize={"xl"}>Allocations</FormLabel>

                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Category</Th>
                        <Th>Name</Th>
                        <Th isNumeric>Allocation per month</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Food</Td>
                        <Td>Payment</Td>
                        <Td isNumeric>$15.32</Td>
                      </Tr>
                      <Tr>
                        <Td>Entertainment</Td>
                        <Td>Deposit</Td>
                        <Td isNumeric>$30.48</Td>
                      </Tr>
                      <Tr>
                        <Td>Savings</Td>
                        <Td>Monthly Student Loan Payment</Td>
                        <Td isNumeric>$200</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              <Divider borderColor={"currentcolor"} my={2} />
            </Box>

            <SubmitButton>Finish</SubmitButton>
          </Container>
        )}
      </Formik>
    </ProtectedPage>
  );
}
