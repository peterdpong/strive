import { Box, Container, Heading, HStack, VStack } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import { useAuth } from "../../src/auth/auth";
import { Formik } from "formik";
import { setIncome } from "../../src/firebase/UserActions";
import { NumberInputControl, SubmitButton } from "formik-chakra-ui";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function FinancesPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  if (userData === null) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
        >
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Update your financial information
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <Formik
            initialValues={{
              annualIncome: userData
                ? userData.financialInfo.annualIncome.toString()
                : "0",
              payfreq:
                userData && userData.financialInfo.payfreq
                  ? userData.financialInfo.payfreq.toString()
                  : "0",
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                setIncome(
                  userData.uid,
                  parseFloat(values.annualIncome),
                  parseFloat(values.payfreq)
                );
                actions.resetForm;
              }
            }}
          >
            {({ handleSubmit, values }) => (
              <Container
                maxW="container.xl"
                as="form"
                p={"0px"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={handleSubmit as any}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Net Take Home Pay ($)
                </Heading>
                <NumberInputControl
                  name="annualIncome"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    precision: 2,
                    value: values.annualIncome,
                  }}
                />
                <Heading mb={"5px"} fontSize={"xl"}>
                  Pay Frequency
                </Heading>
                <NumberInputControl
                  name="payfreq"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 1,
                    precision: 2,
                    value: values.payfreq,
                  }}
                />

                <SubmitButton my={"1rem"} colorScheme={"green"}>
                  Update Income
                </SubmitButton>
              </Container>
            )}
          </Formik>
        </Box>
      </Sidebar>
    </ProtectedRoute>
  );
}
