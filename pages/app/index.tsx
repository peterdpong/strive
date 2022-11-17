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
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <Box>
      <Container maxW="container.lg" rounded={"5px"} px={"0px"} mt="60px">
        <HStack justifyContent="space-between">
          <Heading size="md" mr="2.5rem">
            Hello John
          </Heading>
          <Box bgColor="#D9D9D9" padding="4" borderRadius="75">
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
                Add transaction
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
          <Heading size="lg">Your goals</Heading>
          <Divider my={1} />
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="md">Long-term goal</Heading>
              <Stat>
                <StatLabel fontSize="xl">Net Worth</StatLabel>
                <StatNumber fontSize="3xl">$123.56</StatNumber>
                <StatHelpText fontSize="lg">
                  <StatArrow type="increase" />
                  On track!
                </StatHelpText>
              </Stat>
            </VStack>
            <VStack align="flex-start">
              <Heading size="md">Monthly goal</Heading>
              <Stat>
                <StatLabel fontSize="xl">Lower food spending</StatLabel>
                <StatNumber fontSize="3xl">$123.56</StatNumber>
                <StatHelpText fontSize="lg">
                  <StatArrow type="increase" />
                  On track!
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
          <Heading size="lg">Your suggestions</Heading>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Suggestion 1
                  </Box>
                  <Badge colorScheme="green">Savings opportunity</Badge>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Suggestion 2
                  </Box>
                  <Badge colorScheme="red">Increased spending</Badge>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        <Box py={2}>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={4}
          >
            <GridItem rowSpan={2} colSpan={1} bg="tomato">
              <Heading>Fixed monthly</Heading>
            </GridItem>
            <GridItem colSpan={2} bg="papayawhip">
              <Heading>Monthly Budget - November 2022</Heading>
            </GridItem>
            <GridItem colSpan={2} bg="papayawhip">
              <Heading>Your accounts</Heading>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
