import { Container, Heading } from "@chakra-ui/react";
import ProtectedRoute from "../../src/auth/ProtectedRoute";

export default function GoalsPage() {
  return (
    <ProtectedRoute>
      <Container>
        <Heading>Goals Page</Heading>
      </Container>
    </ProtectedRoute>
  );
}
