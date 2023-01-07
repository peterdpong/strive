import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import * as React from "react";
import { Card } from "./Card";

export const FullPageLoading = () => (
  <Box minH="100vh" px={{ base: "4", lg: "8" }}>
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" rounded={6}>
        <Card>
          <Center>
            <Spinner size="lg" color={"blue.300"} thickness={"3px"} />
          </Center>
        </Card>
      </Flex>
    </Flex>
  </Box>
);
