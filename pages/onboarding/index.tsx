import { Button, ButtonGroup, Container, Heading, Text, Box, Flex, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { Image } from '@chakra-ui/react'
import { AspectRatio } from '@chakra-ui/react'

export default function OnboardingIndex() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"gray.100"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        borderColor={"gray.300"}
        centerContent
      >
        <Heading textAlign={"center"}>Welcome to Strive.</Heading>
        <Text fontSize={"md"}>
          The budgeting tool that helps you to reach your financial goals.
        </Text>
        <ButtonGroup variant = 'outline' spacing = '6'>
        <Button
          mt={"15px"}
          colorScheme={"green"}
          onClick={() => router.push("onboarding/finances")}
        >
          Get Started
        </Button>
        <Button
          mt={"15px"}
          colorScheme={"green"}
          onClick={() => router.push("onboarding/about")}
        >
          About
        </Button>
        <Button
          mt={"15px"}
          colorScheme={"green"}
          onClick={() => router.push("onboarding/instructions")}
        >
          Instructions
        </Button>
        </ButtonGroup>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"green.50"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        h={"375px"}
        borderColor={"gray.300"}
        position='relative'
      >
        <Flex justifyContent="space-between" position='relative'>
        {/* <Box boxSize='sm'> */}
          <Image src='/homepic1.png' alt='Pic 1' boxSize='600px'/>
        {/* </Box> */}
          <Heading size='lg'>Visualize your monthly expenses.</Heading>
        </Flex>
      </Container>

      <Container
        maxW="container.xl"
        rounded={"5px"}
        bg={"gray.100"}
        my={"25px"}
        p={"20px"}
        border={"1px"}
        h={"450"}
        borderColor={"gray.300"}
      >
        <Flex>
        <Box boxSize='sm'>
          <Image style={{ alignSelf: 'flex-end' }} justifyContent='right' src='/dashboardvisual.png' alt='Pic 1' />
        </Box>
        {/* <Heading size='lg'>All your budgeting information and alerts in one location.</Heading> */}
        </Flex>
      </Container>

      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Button
          mt={"15px"}
          colorScheme={"green"}
          onClick={() => router.push("onboarding/finances")}
        >
          Get Started
        </Button>
      </Box>
    </ProtectedRoute>
  );
}
