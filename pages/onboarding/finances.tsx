import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { Formik } from "formik";
import { NumberInputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import BankInvestmentAccountModal from "../../components/modals/AccountModals/BankInvestmentAccountModal";
import CreditCardModal from "../../components/modals/AccountModals/CreditCardModal";
import FixedInvestmentsModal from "../../components/modals/AccountModals/FixedInvestmentsModal";
import LoanAccountModal from "../../components/modals/AccountModals/LoanAccountModal";
import OtherAssetsModal from "../../components/modals/AccountModals/OtherAssetsModal";
import { useAuth } from "../../src/auth/auth";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { deleteAccount, setIncome } from "../../src/firebase/UserActions";

export default function FinancesPages() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const bankInvestmentAccountModalProps = useDisclosure();
  const creditCardModalProps = useDisclosure();
  const fixedInvestmentsModalProps = useDisclosure();
  const loanAccountModalProps = useDisclosure();
  const otherAssetsModalProps = useDisclosure();

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/")}>
          Back
        </Button>
        <Heading>Your Monthly Finances</Heading>
        <Text fontSize={"md"}>What do your finances look like?</Text>

        <Popover closeOnBlur={false} placement="bottom">
          {({ isOpen }: { isOpen: boolean }) => (
            <>
              <PopoverTrigger>
                <Button colorScheme={"green"}>
                  {isOpen ? "Close" : "More information"}
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverHeader fontWeight={"bold"}>
                    Input details
                  </PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Box>
                      In the first field below, please enter your net take home,
                      after tax pay amount. In the second field below, please
                      enter the frequency of your payments (for example, 2 for
                      biweekly or 1 for monthly). Then, please add your bank
                      accounts, investment accounts, any other assets, credit
                      cards and other loans outstanding.
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </>
          )}
        </Popover>
        <Formik
          initialValues={{
            annualIncome: userData
              ? userData.financialInfo.annualIncome.toString()
              : "0",
            payfreq:
              userData && userData.financialInfo.payfreq
                ? userData.financialInfo.payfreq.toString()
                : "0",
          }}
          onSubmit={(values, actions) => {
            if (userData) {
              setIncome(
                userData.uid,
                parseFloat(values.annualIncome),
                parseFloat(values.payfreq)
              );
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
              {/* <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Gross Income ($)
                </Heading>
                <NumberInputControl
                  name="annualIncome"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    // precision: 2,
                    // value: values.annualIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    value: Math.floor(values.annualIncome).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                  }}
                />
              </Box> */}

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Net Take Home Pay ($)
                </Heading>
                <NumberInputControl
                  name="annualIncome"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    precision: 2,
                    value: values.annualIncome,
                  }}
                />
              </Box>

              {/* <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Pay Frequency
                </Heading>

                <NumberInput defaultValue={1} min={1} max={365}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box> */}

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Pay Frequency
                </Heading>
                <NumberInputControl
                  name="payFreq"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    precision: 2,
                    value: values.payfreq,
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
                  <Heading fontSize={"xl"}>Accounts</Heading>
                  <HStack>
                    <Button
                      colorScheme={"green"}
                      onClick={bankInvestmentAccountModalProps.onOpen}
                      size="sm"
                    >
                      Add bank account
                    </Button>
                    <Button
                      colorScheme={"green"}
                      onClick={fixedInvestmentsModalProps.onOpen}
                      size="sm"
                    >
                      Add investment account
                    </Button>
                    <Button
                      colorScheme={"green"}
                      onClick={otherAssetsModalProps.onOpen}
                      size="sm"
                    >
                      Add other asset
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
                    onClick={bankInvestmentAccountModalProps.onOpen}
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

                {/* Fixed investments */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Investment accounts
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
                      Add an investment account
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
                                    {currAccount.startDate
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Maturity date</StatLabel>
                                  <StatLabel>
                                    {currAccount.maturityDate
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
                                    "FixedInvestment",
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

                {/* Other assets */}
                <Heading mb={"10px"} fontSize={"lg"}>
                  Other assets
                </Heading>
                {userData &&
                (userData.financialInfo.accounts.otherAssets === undefined ||
                  Object.keys(userData.financialInfo.accounts.otherAssets)
                    .length === 0) ? (
                  <Center
                    onClick={otherAssetsModalProps.onOpen}
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
                      Add a miscellaneous asset
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    pb={"20px"}
                  >
                    {userData &&
                      userData.financialInfo.accounts.otherAssets &&
                      Object.keys(
                        userData.financialInfo.accounts.otherAssets
                      ).map((accountKey) => {
                        const currAccount =
                          userData.financialInfo.accounts.otherAssets[
                            accountKey
                          ];
                        return (
                          <Card
                            bgColor={"white"}
                            key={accountKey}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>OTHER ASSET</Badge>
                              <Heading size="sm"> {currAccount.name} </Heading>
                              <Stat>
                                <StatLabel>Asset Value</StatLabel>
                                <StatNumber>${currAccount.value}</StatNumber>
                              </Stat>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "OtherAsset",
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
                                <StatLabel>Amount Owed</StatLabel>
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
              </Box>

              <SubmitButton colorScheme={"green"}>Next Step</SubmitButton>
            </Container>
          )}
        </Formik>
      </Container>

      <LoanAccountModal
        isOpen={loanAccountModalProps.isOpen}
        onClose={loanAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <BankInvestmentAccountModal
        isOpen={bankInvestmentAccountModalProps.isOpen}
        onClose={bankInvestmentAccountModalProps.onClose}
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

      <OtherAssetsModal
        isOpen={otherAssetsModalProps.isOpen}
        onClose={otherAssetsModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
