import {
  Container,
  Box,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  SubmitButton,
} from "formik-chakra-ui";
import React, { FormEvent, useCallback, useState } from "react";
import { useAuth } from "../src/auth/auth";

function EmailSignUpForm(
  props: React.PropsWithChildren<{
    onSignUp: () => void;
  }>
) {
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (auth.loading) return;
      setError(null);

      return auth
        .createUserEmail(email, password, firstName, lastName)
        .then(() => {
          props.onSignUp();
        })
        .catch((error) => {
          setError(error.message);
        });
    },
    [auth, props]
  );

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        age: undefined,
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

        if (values.firstName.length === 0) {
          setError("First Name missing.");
          actions.resetForm();
          return;
        }

        if (values.lastName.length === 0) {
          setError("Last Name missing.");
          actions.resetForm();
          return;
        }

        if (values.age === undefined) {
          setError("Age not provided.");
          actions.resetForm();
          return;
        }

        auth
          .createUserEmail(
            values.email,
            values.password,
            values.firstName,
            values.lastName,
            values.age
          )
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
              Strive Signup
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
            <InputControl name="firstName" label="First Name" />
            <InputControl name="lastName" label="Last Name" />
            <NumberInputControl name="age" label="Age" />
            <br />
            <SubmitButton>Sign up</SubmitButton>
          </Box>
        </Container>
      )}
    </Formik>
  );
}

export default EmailSignUpForm;
