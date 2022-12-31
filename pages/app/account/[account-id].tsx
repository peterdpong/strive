import { Container, Heading } from "@chakra-ui/react";
import ProtectedPage from "../../../components/ProtectedPage";

export default function AccountPage() {
  return (
    <ProtectedPage whenSignedOut="login">
      <Container>
        <Heading>Account Page</Heading>
      </Container>
    </ProtectedPage>
  );
}
