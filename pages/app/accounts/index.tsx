import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";

import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import Sidebar from "../../../components/app/Sidebar";
import { useAuth } from "../../../src/auth/auth";
import { deleteAccount } from "../../../src/firebase/UserActions";
import { Timestamp } from "firebase/firestore";

export default function AccountsPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
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
          my={"2rem"}
        >
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Accounts
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <Heading size="lg" mr="2.5rem">
            Net worth
          </Heading>
        </Box>

        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          >
            {userData &&
              Object.keys(userData.financialInfo.accounts.bankAccounts).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.bankAccounts[accountKey];
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
                          <StatNumber>{currAccount.interestRate}%</StatNumber>
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
                }
              )}
            {userData &&
              Object.keys(userData.financialInfo.accounts.fixedInvestments).map(
                (accountKey) => {
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
                            <StatNumber>{currAccount.interestRate}%</StatNumber>
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
                }
              )}

            {userData &&
              userData.financialInfo.accounts.otherAssets &&
              Object.keys(userData.financialInfo.accounts.otherAssets).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.otherAssets[accountKey];
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
                }
              )}

            {userData &&
              Object.keys(userData.financialInfo.accounts.creditCards).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.creditCards[accountKey];
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
                          <StatNumber>${currAccount.amountOwned}</StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel>Account Interest Rate</StatLabel>
                          <StatNumber>{currAccount.interestRate}%</StatNumber>
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
                }
              )}

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
                          <StatNumber>{currAccount.interestRate}%</StatNumber>
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
                          <StatNumber>${currAccount.minimumPayment}</StatNumber>
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
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
