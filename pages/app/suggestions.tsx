import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Heading, HStack, VStack } from "@chakra-ui/react";

import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import { useAuth } from "../../src/auth/auth";

export default function SuggestionsPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  console.log(userData)
  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="6" borderRadius="25">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Suggestions
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box rounded={"5px"} px={"0px"}>
          {userData && Object.entries(userData.suggestions).map((object) => {
            return (
              <div>
                <Heading>{object[0]}</Heading>
                <Accordion allowMultiple>
                  {object[1].map((suggestion) => {
                    return (
                      <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {suggestion.suggestionTitle}
                  </Box>
                  <Badge colorScheme="green">{suggestion.suggestionBadge}</Badge>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
              {suggestion.suggestionDescription}
              </AccordionPanel>
            </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            )
          })}
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
