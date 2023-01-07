import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";

export default function OnboardingIndex() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Container
        bg={"gray.300"}
        maxW="container.md"
        rounded={"5px"}
        my={"25px"}
        p={"25px"}
        centerContent
      >
        <Heading textAlign={"center"}>Welcome to Circulation.</Heading>
        <Text fontSize={"xl"}>Your personal finance manager.</Text>
        <Button onClick={() => router.push("onboarding/goal")}>
          Get Started
        </Button>
      </Container>
    </ProtectedRoute>
  );
}
