import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Heading,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import React, { useState } from "react";
import { useAuth } from "../src/auth/auth";

function EmailSignInForm(
  props: React.PropsWithChildren<{
    onSignUp: () => void;
  }>
) {
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values, actions) => {
        if (auth.loading) return;
        setError(null);

        if (values.email.length === 0) {
          setError("Email missing.");
          actions.resetForm();
          return;
        }

        if (values.password.length === 0) {
          setError("Password missing.");
          actions.resetForm();
          return;
        }

        auth
          .signinEmail(values.email, values.password)
          .then(() => {
            props.onSignUp();
          })
          .catch((error) => {
            setError(error.message);
          });
      }}
    >
      {({ handleSubmit }) => (
        <Container
          maxW="container.xl"
          as="form"
          p={"0px"}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleSubmit as any}
        >
          <Box
            bg={"gray.100"}
            rounded={"5px"}
            my={"25px"}
            p={"20px"}
            border={"1px"}
            borderColor={"gray.300"}
          >
            <Heading mb={"5px"} fontSize={"xl"}>
              Strive Login
            </Heading>
            {error !== null ? (
              <Alert my={"1rem"} status="error">
                <AlertIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            ) : null}
            <InputControl name="email" label="Email" />
            <InputControl
              name="password"
              inputProps={{ type: "password" }}
              label="Password"
            />

            <br />
            <SubmitButton>Log in</SubmitButton>
          </Box>
        </Container>
      )}
    </Formik>
  );
}

export default EmailSignInForm;
