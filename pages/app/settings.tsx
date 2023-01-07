import { Box, Button, Heading, HStack, VStack } from "@chakra-ui/react";

import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import { useAuth } from "../../src/auth/auth";

export default function Settings() {
  const { signOutAuth } = useAuth();

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="4" borderRadius="25">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Settings
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box rounded={"5px"} py={"10px"}>
          <Button
            onClick={() => {
              signOutAuth();
            }}
          >
            Log out
          </Button>
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
