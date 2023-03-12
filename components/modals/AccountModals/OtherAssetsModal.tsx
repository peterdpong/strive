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
import { AssetTypes } from "../../../src/models/AccountModel";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import { addAccount } from "../../../src/firebase/UserActions";

export default function OtherAssetsModal(props: {
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
        <ModalHeader>Add an asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              type: AssetTypes.HOUSE,
              value: "0",
              error: null,
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                addAccount(
                  userData.uid,
                  userData.financialInfo.accounts,
                  "OtherAsset",
                  {
                    name: values.name,
                    type: values.type,
                    value: parseFloat(values.value),
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
                <InputControl name="name" label="Asset Name" />
                <NumberInputControl
                  name="value"
                  label="Asset Value"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <SelectControl
                  name="type"
                  label="Asset Type"
                  selectProps={{ placeholder: "Select other asset type" }}
                >
                  <option value={AssetTypes.HOUSE}>{AssetTypes.HOUSE}</option>
                  <option value={AssetTypes.VEHICLE}>
                    {AssetTypes.VEHICLE}
                  </option>
                  <option value={AssetTypes.COLLECTIBLES}>
                    {AssetTypes.COLLECTIBLES}
                  </option>
                  <option value={AssetTypes.ART}>{AssetTypes.ART}</option>
                  <option value={AssetTypes.VALUABLES}>
                    {AssetTypes.VALUABLES}
                  </option>
                  <option value={AssetTypes.OTHERASSETS}>
                    {AssetTypes.OTHERASSETS}
                  </option>
                </SelectControl>
                {values.error !== null ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{values.error}</AlertTitle>
                  </Alert>
                ) : (
                  <></>
                )}
                <SubmitButton mt={"20px"} colorScheme={"green"}>
                  Add other asset
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
