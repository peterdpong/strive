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

export default function FixedInvestmentsModal(props: {
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
        <ModalHeader>Add a fixed investment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              startDate: "",
              maturityDate: "",
              startingValue: 0,
              interestRate: 0,
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
                  label="Remaining owned"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="interestRate"
                  label="Fixed Investment Interest Rate (%)"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
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
                  Add fixed investment
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
