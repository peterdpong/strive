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

export default function AboutPage() {
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
        <Heading textAlign={"center"}>About</Heading>
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
            About Strive.
          </Heading>
          <Text>
          Strive is your personal finance tool for budgeting. Input your
          finances and target savings goal and receive personalized suggestions on
          how best to reach your goal. Suggestions are supported by calculations
          and sources where appropriate. Disclaimer: the outputs are suggestions
          and should not be taken as financial advice.
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