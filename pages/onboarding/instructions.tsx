import {
  Button,
  ButtonGroup,
  Container,
  Heading,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { Image } from "@chakra-ui/react";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"gray.100"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
        centerContent
      >
        <Heading textAlign={"center"}>Quick Guide</Heading>
        <ButtonGroup variant="outline" spacing="6">
          <Button
            mt={"15px"}
            colorScheme={"green"}
            onClick={() => router.push("/onboarding")}
          >
            Home
          </Button>
          <Button
            mt={"15px"}
            colorScheme={"green"}
            onClick={() => router.push("/onboarding/finances")}
          >
            Get Started
          </Button>
        </ButtonGroup>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"green.50"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
      >
        <VStack>
          <Heading size="md">
            Setting up your profile.
          </Heading>
          <Text>
            Strive allows you to create a financial goal and monitor your progress with our projections and visualizations.
            In order to use Strive, you'll need to click 'Get Started' above and input three items on the proceeding pages: 
            your financial accounts & loans, your monthly net income along with any recurring monthly expenses 
            and your savings goal amount & timeline.
          </Text>
          {/* <Image src="/financespic.PNG" alt="Pic 1" /> */}
        </VStack>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"gray.100"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
      >
        <VStack>
          <Heading size="md">Add your financial savings goal and select your preferred savings journey.</Heading>
          {/* <Image src="/homepic1.png" alt="Pic 1" /> */}
          <Text>
            Strive reimagines the process of budgeting towards a goal.  Here, you'll enter a financial savings goal,
            whether it be a specific net worth or enough money for a downpayment on the home of your dreams.  You'll also
            set a time period that you'd like to accomplish your goal by.  We give you the flexibility of either using your
            own interest rate or the Bank of Canada rate, updated and pulled live.
          </Text>
          <Image src="/savingsgoalpic.png" alt="Savings Goal" />
          <Text>
            Next, you'll choose your desired savings path.  Strive gives you three ways to reach your financial savings goal:
            a base option, a conservative one (you can save less but it'll take slightly longer to reach your goal) and an aggressive
            one (adhering to these monthly savings will expedite your budgeting journey).  Strive shows a savings tracker graph that
            aligns with your personalized savings option.
          </Text>
          </VStack>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"green.50"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
      >
        <VStack>
          <Heading size="md">
            Keep budgeting hassle-free with Strive's dashboard.
          </Heading>
          <Text>
            The dashboard is your very own control center.  There are several key sections here.  You have your 'Goal Overview',
            which recaps your financial goal, timeline and monthly savings from the onboarding process.  Below, Strive provides
            suggestions and alerts, which is divided into several components including money allocation and financial health. 
          </Text>
          <Image src="/suggestions.png" alt="Savings Goal" />
          <Text>
            'Monthly Transactions' is where you'll input your actual recorded transactions.  $450 on groceries, $25 on Netflix -
            it all goes here.  Using this information, Strives shows your estimated goal progress based on your goal inputs in
            onboarding versus your actual, dynamic projected goal progress, shown below.  This, coupled with a breakdown of how
            you're spending your money monthly via a category spending chart, gives you the knowledge you need to be in the driver's seat
            to make informed decisions and reach your financial goal.
          </Text>
          <Image src="/goalprogress.png" alt="Savings Goal" />
          {/* <Image src="/financespic.PNG" alt="Pic 1" /> */}
        </VStack>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"gray.100"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
      >
        <VStack>
          <Heading size="md">Ready to go?  Click below to get started.</Heading>
          {/* <Image src="/homepic1.png" alt="Pic 1" /> */}
          </VStack>
      </Container>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          my={"15px"}
          colorScheme={"green"}
          onClick={() => router.push("onboarding/finances")}
        >
          Get Started
        </Button>
      </Box>
    </ProtectedRoute>
  );
}