import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  SimpleGrid,
  CardFooter,
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
} from "chart.js";
import { useRouter } from "next/router";
import { Bar } from "react-chartjs-2";
import ProtectedPage from "../../components/ProtectedPage";

// Boilerplate data
const labels = ["January", "February", "March", "April", "May", "June"];
const horizontalOptions = {
  indexAxis: "y" as const,
  responsive: true,
  borderRadius: 100,
};
const data = {
  labels: labels,
  datasets: [
    {
      label: "Data",
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();

  return (
    <ProtectedPage whenSignedOut="login">
      <Box>
        <Container maxW="container.lg" rounded={"5px"} px={"0px"} mt="60px">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="md" mr="2.5rem">
                Circulation
              </Heading>
              <Text fontSize="lg" mr="2.5rem">
                Good morning, John
              </Text>
            </VStack>
            <Box bgColor="gray.100" padding="4" borderRadius="75">
              <HStack>
                <Text
                  fontSize="sm"
                  as="b"
                  padding={2}
                  borderRight="2px"
                  borderColor="gray.800"
                >
                  Quick Actions
                </Text>
                <Button colorScheme="black" variant="outline">
                  New transaction
                </Button>
                <Button colorScheme="black" variant="outline">
                  Create monthly budget
                </Button>
                <Button colorScheme="black" variant="outline">
                  Add monthly goal
                </Button>
              </HStack>
            </Box>
          </HStack>

          <Box py={2}>
            <HStack>
              <Heading size="lg">Your goals</Heading>
              <Button
                onClick={() => router.push("app/goals")}
                size="xs"
                variant="outline"
              >
                See all goals
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

          <Box py={2}>
            <Card>
              <CardBody>
                <Heading my={2} size="lg">
                  Your suggestions and alerts
                </Heading>
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </Box>

          <Box py={2}>
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(3, 1fr)"
              gap={4}
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Heading size="lg">Fixed monthly</Heading>
                <Bar data={data} options={horizontalOptions} />
                <Button mt={2} size="sm">
                  Adjust fixed monthly transactions
                </Button>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack justifyContent="space-between">
                  <Heading size="lg">Monthly Transactions</Heading>
                  <Button size="sm" colorScheme="green">
                    New transaction
                  </Button>
                </HStack>
                <Text fontSize="md">November 2022</Text>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Transaction Date</Th>
                        <Th>Account</Th>
                        <Th>Name</Th>
                        <Th isNumeric>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Nov 12, 2022</Td>
                        <Td>Credit Card</Td>
                        <Td>Payment</Td>
                        <Td isNumeric>-$15.32</Td>
                      </Tr>
                      <Tr>
                        <Td>Nov 11, 2022</Td>
                        <Td>Savings account</Td>
                        <Td>Deposit</Td>
                        <Td isNumeric>+$30.48</Td>
                      </Tr>
                      <Tr>
                        <Td>Nov 10, 2022</Td>
                        <Td>Student Loan</Td>
                        <Td>Monthly Student Loan Payment</Td>
                        <Td isNumeric>-$200</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button
                  onClick={() => router.push("app/month/nov-2022")}
                  mt={2}
                  size="sm"
                >
                  See monthly budget
                </Button>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack my={2} justifyContent="space-between">
                  <Heading size="lg">Your accounts</Heading>
                  <Button size="sm" colorScheme="green">
                    New account
                  </Button>
                </HStack>
                <SimpleGrid
                  spacing={4}
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                >
                  <Card justify="space-between">
                    <CardBody>
                      <Badge colorScheme="red">CREDIT CARD</Badge>
                      <Heading size="sm"> American Express Cobalt </Heading>
                      <Stat>
                        <StatLabel>Current Balance</StatLabel>
                        <StatNumber>$123.56</StatNumber>
                        <StatLabel>Payment Due</StatLabel>
                        <StatNumber fontSize="md">Nov 26, 2022</StatNumber>
                      </Stat>
                    </CardBody>
                    <CardFooter>
                      <Button size="xs" variant="link">
                        Account details
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card justify="space-between">
                    <CardBody>
                      <Box>
                        <Badge colorScheme="red">LOAN</Badge>
                        <Heading size="sm">
                          Canada-Ontario Integrated Student Loan
                        </Heading>
                        <Stat>
                          <StatLabel>Remaining Balance</StatLabel>
                          <StatNumber>$123.56</StatNumber>
                          <StatLabel>Next Payment Due</StatLabel>
                          <StatNumber fontSize="md">Nov 29, 2022</StatNumber>
                        </Stat>
                      </Box>
                    </CardBody>
                    <CardFooter>
                      <Button size="xs" variant="link">
                        Account details
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card justify="space-between">
                    <CardBody>
                      <Box>
                        <Badge colorScheme="green">SAVINGS ACCOUNT</Badge>
                        <Heading size="sm"> Tangerine Savings Account </Heading>
                        <Stat>
                          <StatLabel>Balance</StatLabel>
                          <StatNumber>$123.56</StatNumber>
                          <StatLabel>Interest Rate</StatLabel>
                          <StatNumber fontSize="md">3.40%</StatNumber>
                        </Stat>
                      </Box>
                    </CardBody>
                    <CardFooter>
                      <Button size="xs" variant="link">
                        Account details
                      </Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </GridItem>
            </Grid>
          </Box>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
