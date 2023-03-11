import { Button, Container, Heading, Text } from "@chakra-ui/react";

import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/")}>
          Back
        </Button>
        <Heading>How to Navigate Strive</Heading>
        <Text fontSize={"md"}>
          To Do: Instructions.
        </Text>
        <Button size="sm" onClick={() => router.push("/onboarding/finances/")}>
          Get Started
        </Button>
      </Container>
    </ProtectedRoute>
  );
}