import { Container, Heading } from "@chakra-ui/react";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Container>
        <Heading>Account Page</Heading>
      </Container>
    </ProtectedRoute>
  );
}
