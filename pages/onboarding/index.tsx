import { Button, Container, Heading, Text } from "@chakra-ui/react";

export default function OnboardingIndex() {
  return (
    <Container
      bg={"gray.300"}
      maxW="container.md"
      rounded={"5px"}
      my={"25px"}
      p={"25px"}
      centerContent
    >
      <Heading textAlign={"center"}>Welcome to financial-optimizer.</Heading>
      <Text fontSize={"xl"}>Let&apos;s build your financial plan.</Text>
      <Button>Get Started.</Button>
    </Container>
  );
}
