import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Heading,
  HStack,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";

export default function SuggestionsPage() {
  return (
    <ProtectedRoute>
      <Sidebar>
        <Box
          bg={"gray.100"}
          rounded={"5px"}
          p={"20px"}
          width={"100%"}
          border={"1px"}
          borderColor={"gray.300"}
        >
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                All Suggestions
              </Heading>
            </VStack>
          </HStack>
        </Box>

        <SimpleGrid columns={2} spacing={4}>
          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Spending and Budget Suggestions
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      Your spending in groceries is over 10% of your monthly
                      income.
                    </Heading>
                  </Box>
                  <Badge colorScheme="red">Spending Alert</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  It is recommended that you do not budget/spend more than{" "}
                  <b>15%</b> of you monthly income on Groceries.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      Spending on entertainment 15% greater than last month
                    </Heading>
                  </Box>
                  <Badge colorScheme="red">Increased spending</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  You spent <b>$143.75</b> this month on Entertainment expenses
                  compared to $125 last month. This is an increase of <b>15%</b>{" "}
                  in Entertainment spending!
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      You have averaged underspending $78 on Transportation,
                      update your budget allocation.
                    </Heading>
                  </Box>
                  <Badge colorScheme="green">Under Budget</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  You averaged underspending <b>$78</b> on Transportation than
                  you allocated in your monthly budget in the last 3 months.
                  Consider revising your Transportation budget allocations.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      You spent $235.65 more on Dining Out than others in your
                      demographic.
                    </Heading>
                  </Box>
                  <Badge colorScheme="red">Demographic Comparision</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  You spent <b>$235.65</b> more on Dining Out than you allocated
                  in your monthly budget. Consider reviewing your Dining Out
                  transactions for this month and revising your budget
                  allocations.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Money Allocation
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      Move $5250 from your Chequing account to a savings account
                      or investment.
                    </Heading>
                  </Box>
                  <Badge colorScheme="green">Growth Opportunity</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  We noticed $5250 has been sitting in your chequings account
                  for the past 2 months only gaining 0.5% interest. <br />
                  <Text as="b">Suggestions</Text>
                  <br />
                  <UnorderedList>
                    <ListItem>
                      Move this money to your savings account which has an
                      interest rate of 3.5% gaining $183.75 per year.
                    </ListItem>
                    <ListItem>
                      If you do not need this money in the short-term consider a
                      Guarenteed Investment Account or investing the money
                      providing gains of $262.50 to $367.50 per year.
                    </ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>$6000 in unused TFSA room</Heading>
                  </Box>
                  <Badge colorScheme="green">Unused TFSA Room</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  A TFSA account allows you to grow your money tax free,
                  consider using depositing into this account for tax-free
                  growth.
                  <br />
                  <Text as="b">Suggestions</Text>
                  <br />
                  <UnorderedList>
                    <ListItem>
                      Open a TFSA Savings account at an interest rate of 3%
                      providing $182.50 in tax-free interest per year.
                    </ListItem>
                    <ListItem>
                      Lock in an interest rate with a Guarenteed Investment
                      Account with a 5% interest rate on a 2 year term. This
                      will provide you $629.65 in tax-free interest by the end
                      of the term!
                    </ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Goal and Savings
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      You are 10% ahead of your goal on track to hit a net worth
                      of $550,000 in 20 years.
                    </Heading>
                  </Box>
                  <Badge colorScheme="green">Goal Reprojection</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Your current goal is $500,000 in 20 years but currently you
                  are 10% ahead of your goal.
                  <br />
                  You are now on track to hit a net worth of $550,000 in 20
                  years,{" "}
                  <b>consider updating your goal to match your new target</b>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      Your current month savings is $2520, under your monthly
                      goal of $3000
                    </Heading>
                  </Box>
                  <Badge colorScheme="red">Monthly Savings</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Financial Health
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>Build Emergency Fund</Heading>
                  </Box>
                  <Badge colorScheme="blue">Emergency Fund</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Based on your average 6 months of spending, your{" "}
                  <b>average spending is $675.34</b>.<br />
                  It is recommened you have 6 months worth of spending as an
                  emergency fund, thus your suggested
                  <b> Emergency Fund Amount is $4052.04</b>.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      2023 Tax Deadline - April 30th, 2023
                    </Heading>
                  </Box>
                  <Badge colorScheme="blue">Tax Deadline</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size={"sm"}>
                      RRSP Deposit deadline - March 1st, 2023
                    </Heading>
                  </Box>
                  <Badge colorScheme="blue">RRSP Deposit Deadline</Badge>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </SimpleGrid>
      </Sidebar>
    </ProtectedRoute>
  );
}
