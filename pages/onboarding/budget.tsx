import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Flex,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { useAuth } from "../../src/auth/auth";
import BudgetAllocationModal from "../../components/modals/BudgetAllocationModal";
import {
  deleteBudgetAllocation,
  updateMonthlyVariableBudget,
} from "../../src/firebase/UserActions";
import { buildDoughnutGraphData } from "../../src/visualization/BudgetVisualizationsHelpers";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetPage() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const budgetAllocationModalProps = useDisclosure();

  const onDeleteAllocation = (key: string) => {
    if (
      userData &&
      Object.keys(userData.budgetInfo.monthlyAllocations).includes(key)
    ) {
      deleteBudgetAllocation(
        userData.uid,
        userData.budgetInfo.monthlyAllocations,
        key
      );
    }
  };

  if (userData) {
    updateMonthlyVariableBudget(userData);
  }

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/finances")}>
          Back
        </Button>
        <Heading>Create a budget</Heading>
        <Text fontSize={"md"}>
          Budget your variable expenses, no need to allocate it all!
        </Text>

        <Container maxW="container.xl" as="form" p={"0px"}>
          <Flex
            bg={"gray.100"}
            rounded={"5px"}
            my={"25px"}
            p={"20px"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <Box flex="2">
              <VStack align="flex-start">
                <Stat>
                  <StatLabel fontSize="xl">
                    Balance before Category Allocations
                  </StatLabel>
                  <StatNumber fontSize="3xl">
                    ${userData?.budgetInfo.monthlyVariableBudget.toFixed(2)}
                  </StatNumber>
                  <StatLabel fontSize="xl">
                    Balance after Category Allocations
                  </StatLabel>
                  <StatNumber fontSize="3xl">
                    $
                    {userData?.budgetInfo.monthlyVariableBudgetUnallocated.toFixed(
                      2
                    )}
                  </StatNumber>
                </Stat>
              </VStack>
            </Box>
            <Box flex="3">
              <Doughnut
                data={buildDoughnutGraphData(userData?.budgetInfo)}
                options={{
                  aspectRatio: 2,
                }}
              />
            </Box>
          </Flex>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            my={"25px"}
            p={"20px"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <HStack justifyContent="space-between" my={2}>
              <FormLabel fontSize={"xl"}>Category allocations</FormLabel>
              <Button
                onClick={budgetAllocationModalProps.onOpen}
                colorScheme={"green"}
                size="sm"
              >
                Add a category
              </Button>
            </HStack>

            {userData &&
            Object.keys(userData.budgetInfo.monthlyAllocations).length === 0 ? (
              <Center
                onClick={budgetAllocationModalProps.onOpen}
                bg={"gray.50"}
                width={"200px"}
                height={"200px"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderStyle={"dashed"}
                borderColor={"gray.300"}
              >
                <Text color={"gray.800"} align={"center"}>
                  Add your monthly allocation for a category
                </Text>
              </Center>
            ) : (
              <SimpleGrid
                spacing={4}
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              >
                {userData &&
                  Object.keys(userData.budgetInfo.monthlyAllocations).map(
                    (key) => {
                      const currentCategory =
                        userData.budgetInfo.monthlyAllocations[key];

                      return (
                        <Card
                          bgColor={"white"}
                          key={key}
                          justify="space-between"
                        >
                          <CardBody>
                            <Heading color={currentCategory.color} size="sm">
                              {key}
                            </Heading>
                            <Stat>
                              <StatLabel>Monthly Allocation</StatLabel>
                              <StatNumber>
                                ${currentCategory.allocation.toFixed(2)}
                              </StatNumber>
                            </Stat>
                          </CardBody>
                          <CardFooter>
                            <Button
                              onClick={() => {
                                onDeleteAllocation(key);
                              }}
                              size="xs"
                              variant="link"
                            >
                              Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    }
                  )}
              </SimpleGrid>
            )}
          </Box>

          <Button
            onClick={() => {
              if (userData) {
                router.push("/onboarding/goal");
              } else {
                alert("Error: User not logged in...");
                router.push("/login");
              }
            }}
            colorScheme={"green"}
          >
            Next Step
          </Button>
        </Container>
      </Container>

      <BudgetAllocationModal
        isOpen={budgetAllocationModalProps.isOpen}
        onClose={budgetAllocationModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
