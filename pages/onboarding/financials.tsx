import {
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
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const format = (val: number) => `$` + val;
const parse = (val: string) => parseFloat(val.replace(/^\$/, ""));

export default function FinancialsPage() {
  const [goalValue, setGoalValue] = useState<number>(25000);
  const [goalType, setGoalType] = useState<string>("timeframe");

  return (
    <Container
      bg={"gray.400"}
      maxW="container.lg"
      rounded={"5px"}
      my={"25px"}
      p={"25px"}
    >
      <Heading>Goal Creation</Heading>
      <Text fontSize={"lg"}>Where do you want to be financially?</Text>

      <Divider borderColor={"currentcolor"} py={"10px"} />

      <FormLabel fontSize={"xl"}>What&apos;s you net worth goal?</FormLabel>
      <HStack spacing={"8px"}>
        <Slider
          aria-label="slider-ex-1"
          onChange={(value) => setGoalValue(value)}
          value={goalValue}
          defaultValue={goalValue}
          min={5000}
          max={1000000}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <NumberInput
          step={1000}
          onChange={(value) => setGoalValue(parse(value))}
          value={format(goalValue)}
          defaultValue={goalValue}
          min={5000}
          max={1000000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>

      <Divider borderColor={"currentcolor"} py={"10px"} />
      <FormLabel fontSize={"xl"}>Time or Monthly Savings goal?</FormLabel>
      <RadioGroup
        value={goalType}
        onChange={(value) => setGoalType(value)}
        defaultValue="timeframe"
      >
        <HStack spacing="24px">
          <Radio value="timeframe">Timeframe</Radio>
          <Radio value="monthly">Monthly Savings</Radio>
        </HStack>
      </RadioGroup>

      <Divider borderColor={"currentcolor"} py={"10px"} />
      {goalType === "timeframe" ? <Timeframe /> : <Monthly />}

      <Button>Next step</Button>
    </Container>
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
