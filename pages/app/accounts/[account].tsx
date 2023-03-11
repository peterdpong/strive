import { Container, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/app/Sidebar";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";

export default function AccountPage() {
  const router = useRouter();
  const { account } = router.query;

  return (
    <ProtectedRoute>
      <Sidebar>
        <Container>
          <Heading>Account Page</Heading>
        </Container>
      </Sidebar>
    </ProtectedRoute>
  );
}
