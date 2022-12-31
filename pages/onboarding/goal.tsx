import {
  Box,
  Container,
  Divider,
  FormLabel,
  Heading,
  HStack,
  Radio,
  Text,
} from "@chakra-ui/react";
import { Formik } from "formik";
import {
  NumberInputControl,
  RadioGroupControl,
  SliderControl,
  SubmitButton,
} from "formik-chakra-ui";
import { useRouter } from "next/router";
import { useAuth, useSigninCheck } from "reactfire";
import ProtectedPage from "../../components/ProtectedPage";
import { addUserGoal } from "../../src/firebase/UserActions";

const format = (val: number) => `$` + val;

export default function GoalPage() {
  const router = useRouter();
  const auth = useAuth();
  const { status, data } = useSigninCheck();

  return (
    <ProtectedPage whenSignedOut="login">
      <Formik
        initialValues={{
          goalType: "timeframe",
          goalValue: 25000,
          monthlyAmount: 500,
          timeframeValue: 5,
        }}
        onSubmit={(values, actions) => {
          console.log(auth, status, data);
          if (auth.currentUser) {
            addUserGoal(auth.currentUser.uid, values);
            actions.resetForm;
            console.log(values);
            router.push("/onboarding/financials");
          } else {
            alert("Error: User not logged in...");
            //router.push("/login");
          }
        }}
      >
        {({ handleSubmit, values }) => (
          <Container
            bg={"gray.300"}
            maxW="container.lg"
            rounded={"5px"}
            my={"25px"}
            p={"25px"}
            as="form"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={handleSubmit as any}
          >
            <Heading>Goal Creation</Heading>
            <Text fontSize={"lg"}>Where do you want to be financially?</Text>

            <Divider borderColor={"currentcolor"} py={"10px"} />

            <FormLabel fontSize={"xl"}>
              What&apos;s you net worth goal?
            </FormLabel>
            <HStack spacing={"8px"}>
              <SliderControl
                name="goalValue"
                sliderProps={{ min: 5000, max: 1000000 }}
              />

              <NumberInputControl
                name="goalValue"
                numberInputProps={{
                  step: 1000,
                  min: 5000,
                  max: 1000000,
                  value: format(values.goalValue),
                }}
              />
            </HStack>

            <Divider borderColor={"currentcolor"} py={"10px"} />
            <RadioGroupControl
              name="goalType"
              label="Time or Monthly Savings goal? "
            >
              <Radio value="timeframe">Timeframe</Radio>
              <Radio value="monthly">Monthly Savings</Radio>
            </RadioGroupControl>

            <Divider borderColor={"currentcolor"} py={"10px"} />
            {values.goalType === "timeframe" ? (
              <>
                <FormLabel fontSize={"xl"}>
                  By when do you want to achieve your goal?
                </FormLabel>
                <HStack spacing={"8px"}>
                  <SliderControl
                    name="timeframeValue"
                    sliderProps={{ min: 1, max: 20 }}
                  />

                  <NumberInputControl
                    name="timeframeValue"
                    numberInputProps={{
                      min: 1,
                      max: 20,
                      value: values.timeframeValue,
                    }}
                  />
                </HStack>
              </>
            ) : (
              <HStack justifyContent={"space-evenly"}>
                <RadioGroupControl
                  name="monthlyAmount"
                  label="How much would you like to save every month?"
                >
                  <Radio value="1000">$1000</Radio>
                  <Radio value="2000">$2000</Radio>
                  <Radio value="3000">$3000</Radio>
                  <Radio value="4000">$4000</Radio>
                  <Radio value="5000">$5000</Radio>
                </RadioGroupControl>
                <NumberInputControl
                  name="monthlyAmount"
                  numberInputProps={{
                    step: 100,
                    min: 1,
                    max: 25000,
                    value: format(values.monthlyAmount),
                  }}
                />
              </HStack>
            )}
            <Divider borderColor={"currentcolor"} my={2} />
            <SubmitButton>Next Step</SubmitButton>
            <Box as="pre" marginY={10}>
              {JSON.stringify(values, null, 2)}
              <br />
            </Box>
          </Container>
        )}
      </Formik>
    </ProtectedPage>
  );
}
