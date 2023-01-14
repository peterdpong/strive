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
import {
  InputControl,
  NumberInputControl,
  SubmitButton,
} from "formik-chakra-ui";
import { addAccount } from "../../../src/firebase/UserActions";

export default function CreditCardModal(props: {
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
        <ModalHeader>Add a credit card</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              interestRate: 0,
              amountOwned: 0,
              nextPaymentAmount: 0,
              nextPaymentDate: "",
              error: null,
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                addAccount(
                  userData.uid,
                  userData.financialInfo.accounts,
                  "CreditCard",
                  {
                    name: values.name,
                    interestRate: values.interestRate,
                    amountOwned: values.amountOwned,
                    nextPaymentAmount: values.nextPaymentAmount,
                    nextPaymentDate: new Date(values.nextPaymentDate),
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
                <InputControl name="name" label="Account Name" />
                <NumberInputControl
                  name="interestRate"
                  label="Account Interest Rate (%)"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="amountOwned"
                  label="Current amount balance"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="nextPaymentAmount"
                  label="Next payment amount"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <InputControl
                  inputProps={{ type: "date" }}
                  name="nextPaymentDate"
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
                  Add credit card
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
