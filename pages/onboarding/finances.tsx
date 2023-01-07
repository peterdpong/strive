import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Heading,
  HStack,
  SimpleGrid,
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
  useDisclosure,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { NumberInputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import AddAccountModal from "../../components/modals/AddAccountModal";
import RecurringExpenseModal from "../../components/modals/RecurringExpenseModal";
import { useAuth } from "../../src/auth/auth";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import {
  deleteAccount,
  deleteMonthlyTransaction,
  setMonthlyIncome,
} from "../../src/firebase/UserActions";

export default function FinancesPages() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const accountsModalProps = useDisclosure();
  const recurringExpensesModalProps = useDisclosure();

  const onDeleteMonthlyTransaction = (index: number) => {
    if (userData) {
      deleteMonthlyTransaction(
        userData?.uid,
        userData?.financialInfo.monthlyTransactions,
        index
      );
    }
  };

  const onDeleteAccount = (index: number) => {
    if (userData) {
      deleteAccount(userData?.uid, userData?.financialInfo.accounts, index);
    }
  };

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/")}>
          Back
        </Button>
        <Heading>Your Monthly Finances</Heading>
        <Text fontSize={"md"}>What do you finances look like?</Text>

        <Formik
          initialValues={{
            monthlyIncome: 2500,
          }}
          onSubmit={(values, actions) => {
            if (userData) {
              setMonthlyIncome(userData.uid, values.monthlyIncome);
              actions.resetForm;
              router.push("/onboarding/budget");
            } else {
              alert("Error: User not logged in...");
              router.push("/login");
            }
          }}
        >
          {({ handleSubmit, values }) => (
            <Container
              maxW="container.xl"
              as="form"
              p={"0px"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSubmit={handleSubmit as any}
            >
              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Monthly Income ($)
                </Heading>
                <NumberInputControl
                  name="monthlyIncome"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    precision: 2,
                    value: values.monthlyIncome,
                  }}
                />
              </Box>

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <HStack justifyContent="space-between" my={2}>
                  <Heading fontSize={"xl"}>Reccurring Expenses</Heading>
                  <Button
                    colorScheme={"green"}
                    onClick={recurringExpensesModalProps.onOpen}
                    size="sm"
                  >
                    Add reccurring expenses
                  </Button>
                </HStack>

                {userData &&
                userData.financialInfo.monthlyTransactions.length === 0 ? (
                  <Center
                    onClick={recurringExpensesModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"100px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a recurring expenses
                    </Text>
                  </Center>
                ) : (
                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Category</Th>
                          <Th>Name</Th>
                          <Th isNumeric>Amount per month</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {userData?.financialInfo.monthlyTransactions.map(
                          (transaction, index) => {
                            return (
                              <Tr key={index}>
                                <Td>{transaction.category}</Td>
                                <Td>{transaction.name}</Td>
                                <Td isNumeric>{-transaction.amount}</Td>
                                <Td>
                                  <Button
                                    colorScheme={"red"}
                                    size="sm"
                                    onClick={() => {
                                      onDeleteMonthlyTransaction(index);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Td>
                              </Tr>
                            );
                          }
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
              </Box>

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <HStack justifyContent="space-between" my={2}>
                  <Heading fontSize={"xl"}>Accounts</Heading>
                  <Button
                    colorScheme={"green"}
                    onClick={accountsModalProps.onOpen}
                    size="sm"
                  >
                    Add account
                  </Button>
                </HStack>

                {userData && userData.financialInfo.accounts.length === 0 ? (
                  <Center
                    onClick={accountsModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"200px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a financial accounts
                    </Text>
                  </Center>
                ) : (
                  <></>
                )}

                <SimpleGrid
                  spacing={4}
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                >
                  {userData?.financialInfo.accounts.map((account, index) => {
                    return (
                      <Card key={index} justify="space-between">
                        <CardBody>
                          <Badge>{account.type}</Badge>
                          <Heading size="sm"> {account.name} </Heading>
                          <Stat>
                            <StatLabel>Value</StatLabel>
                            <StatNumber>${account.value}</StatNumber>
                          </Stat>
                        </CardBody>
                        <CardFooter>
                          <Button
                            onClick={() => {
                              onDeleteAccount(index);
                            }}
                            size="xs"
                            variant="link"
                          >
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </Box>

              <SubmitButton colorScheme={"green"}>Next Step</SubmitButton>
            </Container>
          )}
        </Formik>
      </Container>

      <RecurringExpenseModal
        isOpen={recurringExpensesModalProps.isOpen}
        onClose={recurringExpensesModalProps.onClose}
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
