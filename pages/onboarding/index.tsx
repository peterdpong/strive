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

export default function OnboardingIndex() {
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
        <Heading textAlign={"center"}>Welcome to Strive.</Heading>
        <Text fontSize={"md"}>
          The budgeting tool that helps you to reach your financial goals.
        </Text>
        <ButtonGroup variant="outline" spacing="6">
          <Button
            mt={"15px"}
            colorScheme={"green"}
            onClick={() => router.push("onboarding/finances")}
          >
            Get Started
          </Button>
          <Button
            mt={"15px"}
            colorScheme={"green"}
            onClick={() => router.push("onboarding/about")}
          >
            About
          </Button>
          <Button
            mt={"15px"}
            colorScheme={"green"}
            onClick={() => router.push("onboarding/instructions")}
          >
            Quick Guide
          </Button>
        </ButtonGroup>
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
          {/* <Box boxSize='sm'> */}
          <Heading size="lg">
            All your budgeting information and alerts in one location.
          </Heading>
          <Image src="/dashboardvisual.png" alt="Pic 1" />
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
          <Heading size="lg">Visualize your monthly expenses.</Heading>
          <Image src="/homepic1.png" alt="Pic 1" />
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
