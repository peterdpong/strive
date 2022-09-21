import React, { FormEvent, useCallback, useEffect } from "react";
import { useSignUpWithEmailAndPassword } from "../src/firebase/firebase-auth";

function EmailSignUpForm(
  props: React.PropsWithChildren<{
    onSignUp: () => void;
  }>
) {
  const [signUp, data, loading, error] = useSignUpWithEmailAndPassword();

  useEffect(() => {
    if (data !== undefined) {
      props.onSignUp();
    }
  }, [props, data]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) return;

      const data = new FormData(event.currentTarget);

      const email = data.get("email") as string;
      const password = data.get("password") as string;

      return signUp(email, password);
    },
    [loading, signUp]
  );

  console.log(data);

  return (
    <form onSubmit={onSubmit}>
      <div className={"flex-col space-y-6"}>
        <input
          required
          placeholder="Your Email"
          name="email"
          type="email"
          className="TextField"
        />

        <input
          required
          placeholder="Your Password"
          name="password"
          type="password"
          className="TextField"
        />

        {error ? <span className="text-red-500">{error.message}</span> : null}

        <button disabled={loading} className="Button w-full">
          Sign Up
        </button>
      </div>
    </form>
  );
}

export default EmailSignUpForm;
