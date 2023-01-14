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

export default function LoanAccountModal(props: {
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
                <InputControl name="name" label="Loan Name" />
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
                  name="interestRate"
                  label="Account Interest Rate (%)"
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