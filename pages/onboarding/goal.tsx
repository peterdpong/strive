import {
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Formik } from "formik";
import {
  NumberInputControl,
  RadioGroupControl,
  SliderControl,
  SubmitButton,
} from "formik-chakra-ui";

const format = (val: number) => `$` + val;

export default function GoalPage() {
  return (
    <Formik
      initialValues={{
        goalType: "timeframe",
        goalValue: 25000,
      }}
      onSubmit={(values, actions) => {
        console.log(values);
        alert(JSON.stringify(values, null, 2));
        actions.resetForm;
      }}
    >
      {({ handleSubmit, values }) => (
        <Container
          bg={"gray.400"}
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

          <FormLabel fontSize={"xl"}>What&apos;s you net worth goal?</FormLabel>
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
          {/* <FormLabel fontSize={"xl"}>Time or Monthly Savings goal?</FormLabel> */}
          <RadioGroupControl
            name="goalType"
            label="Time or Monthly Savings goal? "
          >
            <Radio value="timeframe">Timeframe</Radio>
            <Radio value="monthly">Monthly Savings</Radio>
          </RadioGroupControl>

          <Divider borderColor={"currentcolor"} py={"10px"} />
          {values.goalType === "timeframe" ? <Timeframe /> : <Monthly />}
          <SubmitButton>Next Step</SubmitButton>
          <Box as="pre" marginY={10}>
            {JSON.stringify(values, null, 2)}
            <br />
          </Box>
        </Container>
      )}
    </Formik>
  );
}

function Timeframe() {
  const [timeframeValue, setTimeframeValue] = useState<number>(5);

  return (
    <>
      <FormLabel fontSize={"xl"}>
        By when do you want to achieve your goal?
      </FormLabel>
      <HStack spacing={"8px"}>
        <Slider
          aria-label="slider-ex-1"
          onChange={(value) => setTimeframeValue(value)}
          value={timeframeValue}
          defaultValue={timeframeValue}
          min={1}
          max={20}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <NumberInput
          step={1}
          onChange={(value) => setTimeframeValue(parseInt(value))}
          value={timeframeValue}
          defaultValue={timeframeValue}
          min={1}
          max={20}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </>
  );
}

function Monthly() {
  return (
    <>
      <FormLabel fontSize={"xl"}>
        How much would you like to save every month?
      </FormLabel>
      <HStack justifyContent={"space-evenly"}>
        <Button>$1000</Button>
        <Button>$2000</Button>
        <Button>$3000</Button>
        <Button>$4000</Button>
        <Button>$5000</Button>
        <Stack>
          <NumberInput step={100} min={1} max={25000}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>Press enter to confirm.</Text>
        </Stack>
      </HStack>
    </>
  );
}
