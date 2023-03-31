import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../src/auth/auth";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import { AccountType } from "../../../src/models/AccountModel";
import { addAccount } from "../../../src/firebase/UserActions";
import { Timestamp } from "firebase/firestore";

export default function FixedInvestmentsModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();
  const toast = useToast();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a fixed investment account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              startDate: "",
              maturityDate: "",
              startingValue: "0",
              interestRate: "0",
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                if (values.maturityDate < values.startDate) {
                  // throw Toast error
                  toast({
                    title: "Date Error",
                    description: "Maturity Date must be after Start Date",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  actions.setSubmitting(false);
                } else if (
                  values.name === "" ||
                  values.startDate === "" ||
                  values.maturityDate === ""
                ) {
                  toast({
                    title: "Error",
                    description: "Atleast one input missing value!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  actions.setSubmitting(false);
                } else {
                  addAccount(
                    userData.uid,
                    userData.financialInfo.accounts,
                    "FixedInvestment",
                    {
                      name: values.name,
                      startDate: new Timestamp(
                        Date.parse(values.startDate) / 1000,
                        0
                      ),
                      maturityDate: new Timestamp(
                        Date.parse(values.maturityDate) / 1000,
                        0
                      ),
                      startingValue: parseFloat(values.startingValue),
                      interestRate: parseFloat(values.interestRate),
                    }
                  );
                  actions.resetForm;
                  props.onClose();
                }
              } else {
                alert("Error: User not logged in...");
              }
            }}
          >
            {({ handleSubmit, values }) => (
              <Box
                as="form"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={handleSubmit as any}
              >
                <InputControl name="name" label="Account Name" />
                <SelectControl
                  name="type"
                  label="Account Type"
                  selectProps={{ placeholder: "Select account type" }}
                >
                  <option value={AccountType.TFSA}>{AccountType.TFSA}</option>
                  <option value={AccountType.RRSP}>{AccountType.RRSP}</option>
                  <option value={AccountType.FHSA}>{AccountType.FHSA}</option>
                  <option value={AccountType.GIC}>{AccountType.GIC}</option>
                  <option value={AccountType.NR}>{AccountType.NR}</option>
                </SelectControl>
                <InputControl
                  inputProps={{ type: "date" }}
                  name="startDate"
                  label="Start date"
                />
                <InputControl
                  inputProps={{ type: "date" }}
                  name="maturityDate"
                  label="Maturity date"
                />
                <NumberInputControl
                  name="startingValue"
                  label="Starting value"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="interestRate"
                  label="Investment Interest Rate (%)"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <SubmitButton mt={"20px"} colorScheme={"green"}>
                  Add investment account
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
