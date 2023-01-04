import {
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Heading,
  HStack,
  Radio,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik } from "formik";
import {
  NumberInputControl,
  RadioGroupControl,
  SubmitButton,
} from "formik-chakra-ui";
import { useRouter } from "next/router";
import AddAccountModal from "../../components/modals/AddAccountModal";
import TransactionsModal from "../../components/modals/TransactionsModal";
import { useAuth } from "../../src/auth/auth";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { addFinancialInfo } from "../../src/firebase/UserActions";

export default function FinancesPages() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  console.log(userData);

  const accountsModalProps = useDisclosure();
  const transactionsModalProps = useDisclosure();

  return (
    <ProtectedRoute>
      <Formik
        initialValues={{
          incomeValue: 0,
          incomeIsAnnual: true,
          hoursPerWeek: 0,
          monthlyTransactions: [],
          accounts: [],
        }}
        onSubmit={(values, actions) => {
          if (userData) {
            addFinancialInfo(userData.uid, values);
            actions.resetForm;
            console.log(values);
            router.push("/onboarding/variable");
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
            <Button size="sm" onClick={() => router.push("/onboarding/goal")}>
              Back
            </Button>
            <Heading>Your Finances</Heading>
            <Text fontSize={"lg"}>What does you finances look like?</Text>

            <Divider borderColor={"currentcolor"} py={"10px"} />

            <FormLabel fontSize={"xl"}>What&apos;s your income?</FormLabel>
            <RadioGroupControl
              name="incomeIsAnnual"
              label="Income annual or hourly"
              defaultValue="true"
            >
              <Radio value="true">Annual</Radio>
              <Radio value="false">Hourly</Radio>
            </RadioGroupControl>

            <Divider borderColor={"currentcolor"} py={"10px"} />
            {values.incomeIsAnnual === true ? (
              <>
                <FormLabel fontSize={"xl"}>Annual Income - $/year</FormLabel>
                <NumberInputControl
                  name="incomeValue"
                  numberInputProps={{
                    min: 1,
                    max: 10000000,
                    value: values.incomeValue,
                  }}
                />
              </>
            ) : (
              <>
                <FormLabel fontSize={"xl"}>Hourly Income</FormLabel>
                <HStack justifyContent={"space-evenly"}>
                  <NumberInputControl
                    name="incomeValue"
                    label="Hourly Salary - $/hr"
                    numberInputProps={{
                      min: 1,
                      max: 250,
                      value: values.incomeValue,
                    }}
                  />
                  <NumberInputControl
                    name="hoursPerWeek"
                    label="Hours worked a week"
                    numberInputProps={{
                      step: 1,
                      min: 1,
                      max: 48,
                      value: values.hoursPerWeek,
                    }}
                  />
                </HStack>
              </>
            )}

            <Divider borderColor={"currentcolor"} my={2} />

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>
                  Fixed Monthly Transactions: Rent, Loan payments, and
                  subscriptions
                </FormLabel>
                <Button onClick={transactionsModalProps.onOpen} size="sm">
                  Add monthly transactions
                </Button>
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
            </Box>

            <Divider borderColor={"currentcolor"} my={2} />

            <Box>
              <HStack justifyContent="space-between" my={2}>
                <FormLabel fontSize={"xl"}>Accounts</FormLabel>
                <Button onClick={accountsModalProps.onOpen} size="sm">
                  Add account
                </Button>
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

      <TransactionsModal
        isOpen={transactionsModalProps.isOpen}
        onClose={transactionsModalProps.onClose}
        uid={userData?.uid}
      />

      <AddAccountModal
        isOpen={accountsModalProps.isOpen}
        onClose={accountsModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
