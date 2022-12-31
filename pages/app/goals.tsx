import { Container, Heading } from "@chakra-ui/react";
import ProtectedPage from "../../components/ProtectedPage";

export default function GoalsPage() {
  return (
    <ProtectedPage whenSignedOut="login">
      <Container>
        <Heading>Goals Page</Heading>
      </Container>
    </ProtectedPage>
  );
}
