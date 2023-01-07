import {
  Box,
  Button,
  Container,
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
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { addBudgetInfo } from "../../src/firebase/UserActions";
import { useAuth } from "../../src/auth/auth";

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

export default function BudgetPage() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  console.log(userData);

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/goal")}>
          Back
        </Button>
        <Heading>Create a budget</Heading>
        <Text fontSize={"md"}>
          Budget your variable expenses, no need to allocate it all!
        </Text>
        <Formik
          initialValues={{
            monthlyAllocations: {},
            totalVariableBudget: 0,
          }}
          onSubmit={(values, actions) => {
            if (userData) {
              addBudgetInfo(userData.uid, values);
              actions.resetForm;
              console.log(values);
              router.push("/onboarding/goal");
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
              <Flex
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Box flex="2">
                  <VStack align="flex-start">
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

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <HStack justifyContent="space-between" my={2}>
                  <FormLabel fontSize={"xl"}>Category allocations</FormLabel>
                  <Button colorScheme={"green"} size="sm">
                    Add a category
                  </Button>
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

              <SubmitButton colorScheme={"green"}>Next Step</SubmitButton>
            </Container>
          )}
        </Formik>
      </Container>
    </ProtectedRoute>
  );
}
