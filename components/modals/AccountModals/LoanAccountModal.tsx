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
} from "@chakra-ui/react";
import { useAuth } from "../../../src/auth/auth";
import { Formik } from "formik";
import { LoanTypes } from "../../../src/models/AccountModel";
import {
  InputControl,
  NumberInputControl,
  SubmitButton,
  SelectControl,
} from "formik-chakra-ui";
import { addAccount } from "../../../src/firebase/UserActions";
import { Timestamp } from "firebase/firestore";

export default function LoanAccountModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              remainingAmount: 0,
              minimumPayment: 0,
              interestRate: 0,
              paymentDate: "",
              error: null,
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                addAccount(
                  userData.uid,
                  userData.financialInfo.accounts,
                  "Loan",
                  {
                    name: values.name,
                    remainingAmount: values.remainingAmount,
                    minimumPayment: values.minimumPayment,
                    interestRate: values.interestRate,
                    paymentDate: new Timestamp(
                      Date.parse(values.paymentDate) / 1000,
                      0
                    ),
                  }
                );
                actions.resetForm;
                props.onClose();
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
                <InputControl name="name" label="Loan Name" />
                <SelectControl 
                  name="type" 
                  label="Loan Type"
                  selectProps={{ placeholder: "Select loan type" }}
                >
                  <option value={LoanTypes.MORTGAGE}>
                    {LoanTypes.MORTGAGE}
                  </option>
                  <option value={LoanTypes.CAR}>{LoanTypes.CAR}</option>
                  <option value={LoanTypes.STUDENT}>{LoanTypes.STUDENT}</option>
                </SelectControl>
                <NumberInputControl
                  name="remainingAmount"
                  label="Remaining owned"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="minimumPayment"
                  label="Minimum monthly payment"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="interestRate"
                  label="Loan Interest Rate (%)"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <InputControl
                  inputProps={{ type: "date" }}
                  name="paymentDate"
                  label="Next payment date"
                />
                {values.error !== null ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{values.error}</AlertTitle>
                  </Alert>
                ) : (
                  <></>
                )}
                <SubmitButton mt={"20px"} colorScheme={"green"}>
                  Add loan
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
