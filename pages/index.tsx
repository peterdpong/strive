import { Button, Container, Heading, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  return (
    <Container
      maxW="container.md"
      rounded={"5px"}
      my={"25px"}
      p={"25px"}
      centerContent
    >
      <Heading>Circulation</Heading>
      <HStack>
        <Button onClick={() => router.push("/login")}>Login</Button>
        <Button onClick={() => router.push("/signup")}>Signup</Button>
      </HStack>
    </Container>
  );
}
