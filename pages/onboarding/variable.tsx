import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProtectedPage from "../../components/ProtectedPage";
import { useAuth } from "reactfire";
import { addBudgetInfo } from "../../src/firebase/UserActions";

ChartJS.register(ArcElement, Tooltip, Legend);

// Boilerplate data
const data = {
  labels: ["Food", "Entertainment", "Savings", "Unallocated"],
  datasets: [
    {
      label: "$ Dollars",
      data: [123, 23, 34, 45],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  aspectRatio: 4,
};

export default function VariableBudgetPage() {
  const router = useRouter();
  const auth = useAuth();

  return (
    <ProtectedPage whenSignedOut="login">
      <Formik
        initialValues={{
          monthlyAllocations: {},
          totalVariableBudget: 0,
        }}
        onSubmit={(values, actions) => {
          if (auth.currentUser) {
            addBudgetInfo(auth.currentUser.uid, values);
            actions.resetForm;
            console.log(values);
            router.push("/onboarding/suggestions");
          } else {
            alert("Error: User not logged in...");
            router.push("/login");
          }
        }}
      >
        {({ handleSubmit, values }) => (
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
              onClick={() => router.push("/onboarding/financials")}
            >
              Back
            </Button>
            <Heading>Your variable budget</Heading>
            <Flex>
              <Box flex="2">
                <VStack align="flex-start">
                  <Text fontSize={"lg"}>
                    Allocate your remaining monthly budget
                  </Text>
                  <Stat>
                    <StatLabel fontSize="xl">
                      Remaining monthly budget
                    </StatLabel>
                    <StatNumber fontSize="3xl">$123.56</StatNumber>
                  </Stat>
                </VStack>
              </Box>
              <Box flex="3">
                <Doughnut data={data} options={options} />
              </Box>
            </Flex>

            <Divider borderColor={"currentcolor"} my={2} />

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>Allocations</FormLabel>
                <Button size="sm">Add monthly allocation</Button>
              </HStack>

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

            <SubmitButton>Next Step</SubmitButton>
            <Box as="pre" marginY={10}>
              {JSON.stringify(values, null, 2)}
              <br />
            </Box>
          </Container>
        )}
      </Formik>
    </ProtectedPage>
  );
}
