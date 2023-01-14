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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { Formik } from "formik";
import { NumberInputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import BankAccountModal from "../../components/modals/AccountModals/BankAccountModal";
import CreditCardModal from "../../components/modals/AccountModals/CreditCardModal";
import FixedInvestmentsModal from "../../components/modals/AccountModals/FixedInvestmentsModal";
import LoanAccountModal from "../../components/modals/AccountModals/LoanAccountModal";
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

  const recurringExpensesModalProps = useDisclosure();
  const bankAccountModalProps = useDisclosure();
  const creditCardModalProps = useDisclosure();
  const fixedInvestmentsModalProps = useDisclosure();
  const loanAccountModalProps = useDisclosure();

  const onDeleteMonthlyTransaction = (index: number) => {
    if (userData) {
      deleteMonthlyTransaction(
        userData?.uid,
        userData?.financialInfo.monthlyTransactions,
        index
      );
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
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  >
                    {userData?.financialInfo.monthlyTransactions.map(
                      (transaction, index) => {
                        return (
                          <Card
                            bgColor={"white"}
                            key={index}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>{transaction.category}</Badge>
                              <Heading size="sm"> {transaction.name} </Heading>
                              <Stat>
                                <StatLabel>Expense per month</StatLabel>
                                <StatNumber>-${transaction.amount}</StatNumber>
                              </Stat>
                            </CardBody>
                            <CardFooter>
                              <Button
                                onClick={() => {
                                  onDeleteMonthlyTransaction(index);
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      }
                    )}
                  </SimpleGrid>
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
                  <HStack>
                    <Button
                      colorScheme={"green"}
                      onClick={bankAccountModalProps.onOpen}
                      size="sm"
                    >
                      Add bank account
                    </Button>
                    <Button
                      colorScheme={"green"}
                      onClick={creditCardModalProps.onOpen}
                      size="sm"
                    >
                      Add credit card
                    </Button>
                    <Button
                      colorScheme={"green"}
                      onClick={loanAccountModalProps.onOpen}
                      size="sm"
                    >
                      Add loan
                    </Button>
                    <Button
                      colorScheme={"green"}
                      onClick={fixedInvestmentsModalProps.onOpen}
                      size="sm"
                    >
                      Add fixed investment
                    </Button>
                  </HStack>
                </HStack>

                {/* Bank accounts */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Bank accounts
                </Heading>
                {userData &&
                Object.keys(userData.financialInfo.accounts.bankAccounts)
                  .length === 0 ? (
                  <Center
                    onClick={bankAccountModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"125px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a bank account
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    pb={"20px"}
                  >
                    {userData &&
                      Object.keys(
                        userData.financialInfo.accounts.bankAccounts
                      ).map((accountKey) => {
                        const currAccount =
                          userData.financialInfo.accounts.bankAccounts[
                            accountKey
                          ];
                        return (
                          <Card
                            bgColor={"white"}
                            key={accountKey}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>{currAccount.type}</Badge>
                              <Heading size="sm"> {currAccount.name} </Heading>
                              <Stat>
                                <StatLabel>Account Value</StatLabel>
                                <StatNumber>${currAccount.value}</StatNumber>
                              </Stat>
                              <Stat>
                                <StatLabel>Account Interest Rate</StatLabel>
                                <StatNumber>
                                  {currAccount.interestRate}%
                                </StatNumber>
                              </Stat>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "BankAccount",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </CardBody>
                          </Card>
                        );
                      })}
                  </SimpleGrid>
                )}

                {/* Credit cards */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Credit cards
                </Heading>
                {userData &&
                Object.keys(userData.financialInfo.accounts.creditCards)
                  .length === 0 ? (
                  <Center
                    onClick={creditCardModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"125px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a credit card
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    pb={"20px"}
                  >
                    {userData &&
                      Object.keys(
                        userData.financialInfo.accounts.creditCards
                      ).map((accountKey) => {
                        const currAccount =
                          userData.financialInfo.accounts.creditCards[
                            accountKey
                          ];
                        return (
                          <Card
                            bgColor={"white"}
                            key={accountKey}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>CREDIT CARD</Badge>
                              <Heading size="sm"> {currAccount.name} </Heading>
                              <Stat>
                                <StatLabel>Amount Owned</StatLabel>
                                <StatNumber>
                                  ${currAccount.amountOwned}
                                </StatNumber>
                              </Stat>
                              <Stat>
                                <StatLabel>Account Interest Rate</StatLabel>
                                <StatNumber>
                                  {currAccount.interestRate}%
                                </StatNumber>
                              </Stat>
                              <Stat>
                                <StatLabel>Next payment due</StatLabel>
                                <StatLabel>
                                  {(currAccount.nextPaymentDate as Timestamp)
                                    .toDate()
                                    .toISOString()
                                    .substring(0, 10)}
                                </StatLabel>
                              </Stat>
                              <Stat>
                                <StatLabel>Next payment amount</StatLabel>
                                <StatNumber>
                                  ${currAccount.nextPaymentAmount}
                                </StatNumber>
                              </Stat>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "CreditCard",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </CardBody>
                          </Card>
                        );
                      })}
                  </SimpleGrid>
                )}

                {/* Loans */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Loans
                </Heading>
                {userData &&
                Object.keys(userData.financialInfo.accounts.loans).length ===
                  0 ? (
                  <Center
                    onClick={loanAccountModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"125px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a loan
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    pb={"20px"}
                  >
                    {userData &&
                      Object.keys(userData.financialInfo.accounts.loans).map(
                        (accountKey) => {
                          const currAccount =
                            userData.financialInfo.accounts.loans[accountKey];
                          return (
                            <Card
                              bgColor={"white"}
                              key={accountKey}
                              justify="space-between"
                            >
                              <CardBody>
                                <Badge>LOAN</Badge>
                                <Heading size="sm">{currAccount.name}</Heading>
                                <Stat>
                                  <StatLabel>Account Value</StatLabel>
                                  <StatNumber>
                                    ${currAccount.remainingAmount}
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Interest Rate</StatLabel>
                                  <StatNumber>
                                    {currAccount.interestRate}%
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Next payment due</StatLabel>
                                  <StatLabel>
                                    {(currAccount.paymentDate as Timestamp)
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Minimum Payment</StatLabel>
                                  <StatNumber>
                                    ${currAccount.minimumPayment}
                                  </StatNumber>
                                </Stat>
                                <Button
                                  onClick={() => {
                                    deleteAccount(
                                      userData.uid,
                                      userData.financialInfo.accounts,
                                      "Loan",
                                      accountKey
                                    );
                                  }}
                                  size="xs"
                                  variant="link"
                                >
                                  Delete
                                </Button>
                              </CardBody>
                            </Card>
                          );
                        }
                      )}
                  </SimpleGrid>
                )}

                {/* Fixed investments */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Fixed investments
                </Heading>
                {userData &&
                Object.keys(userData.financialInfo.accounts.fixedInvestments)
                  .length === 0 ? (
                  <Center
                    onClick={fixedInvestmentsModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"125px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a fixed investment
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    pb={"20px"}
                  >
                    {userData &&
                      Object.keys(
                        userData.financialInfo.accounts.fixedInvestments
                      ).map((accountKey) => {
                        const currAccount =
                          userData.financialInfo.accounts.fixedInvestments[
                            accountKey
                          ];
                        return (
                          <Card
                            bgColor={"white"}
                            key={accountKey}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>FIXED INVESTMENT</Badge>
                              <Heading size="sm"> {currAccount.name} </Heading>
                              <Stat>
                                <StatLabel>Account Value</StatLabel>
                                <Stat>
                                  <StatLabel>Start date</StatLabel>
                                  <StatLabel>
                                    {(currAccount.startDate as Timestamp)
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Maturity date</StatLabel>
                                  <StatLabel>
                                    {(currAccount.maturityDate as Timestamp)
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Starting value</StatLabel>
                                  <StatNumber>
                                    ${currAccount.startingValue}
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Interest rate</StatLabel>
                                  <StatNumber>
                                    {currAccount.interestRate}%
                                  </StatNumber>
                                </Stat>
                              </Stat>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "FixedInvestments",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </CardBody>
                          </Card>
                        );
                      })}
                  </SimpleGrid>
                )}
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

      <LoanAccountModal
        isOpen={loanAccountModalProps.isOpen}
        onClose={loanAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <BankAccountModal
        isOpen={bankAccountModalProps.isOpen}
        onClose={bankAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <CreditCardModal
        isOpen={creditCardModalProps.isOpen}
        onClose={creditCardModalProps.onClose}
        uid={userData?.uid}
      />

      <FixedInvestmentsModal
        isOpen={fixedInvestmentsModalProps.isOpen}
        onClose={fixedInvestmentsModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
