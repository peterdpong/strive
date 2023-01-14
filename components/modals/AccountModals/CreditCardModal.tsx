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
import { AccountType } from "../../../src/models/AccountModel";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";

export default function CreditCardModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  // const submitHandler = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();

  //   if (name === null || type === null || value === null) {
  //     setError("A field is missing");
  //     return;
  //   }

  //   if (userData) {
  //     addAccount(userData.uid, userData.financialInfo.accounts, {
  //       name: name,
  //       type: type as AccountType,
  //       accountValue: value,
  //       accountInfo: {},
  //     });
  //   }
  //   props.onClose();
  // };

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
                //setMonthlyIncome(userData.uid, values.monthlyIncome);
                actions.resetForm;
              } else {
                alert("Error: User not logged in...");
              }
            }}
          >
            {({ handleSubmit, values }) => (
              <Box // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={handleSubmit as any}
              >
                <InputControl name="name" label="Account Name" />
                <NumberInputControl
                  name="value"
                  label="Account Value"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
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
