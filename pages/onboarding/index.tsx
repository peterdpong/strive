import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";

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
          The financial budget tool that helps you to reach your goals.
        </Text>
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
      </Container>
    </ProtectedRoute>
  );
}
