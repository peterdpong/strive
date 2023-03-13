import { Button, Container, Heading, Text } from "@chakra-ui/react";

import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";

export default function AboutPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/")}>
          Back
        </Button>
        <Heading>About Strive</Heading>
        <Text fontSize={"md"}>
          Strive is your personal finance tool for budgeting. Input your
          finances and target savings goal and receive personalized suggestions on
          how to best reach your goal. Suggestions are supported by calculations
          and sources where appropriate. Disclaimer: the outputs are suggestions
          and should not be taken as financial advice.
        </Text>
        <Button size="sm" onClick={() => router.push("/onboarding/finances/")}>
          Get Started
        </Button>
      </Container>
    </ProtectedRoute>
  );
}
