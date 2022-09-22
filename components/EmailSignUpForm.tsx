import React, { FormEvent, useCallback, useEffect } from "react";
import { useSignUpWithEmailAndPassword } from "../src/hooks/auth/useSignUpWithEmailAndPassword";

function EmailSignUpForm(
  props: React.PropsWithChildren<{
    onSignUp: () => void;
  }>
) {
  const [signUp, state] = useSignUpWithEmailAndPassword();

  // useEffect hook to trigger once auth state is set to success
  useEffect(() => {
    if (state.success) {
      props.onSignUp();
    }
  }, [props, state.success]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (state.loading) return;

      const data = new FormData(event.currentTarget);

      const email = data.get("email") as string;
      const password = data.get("password") as string;

      return signUp(email, password);
    },
    [state.loading, signUp]
  );

  // TODO(Peter): Styling and use CharkaUI components
  // TODO(Peter): Better form control
  return (
    <form onSubmit={onSubmit}>
      <div>
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

        {state.error ? <span>{state.error.message}</span> : null}

        <button disabled={state.loading}>Sign Up</button>
      </div>
    </form>
  );
}

export default EmailSignUpForm;
