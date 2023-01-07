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

      const data = new FormData(event.currentTarget);

      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const firstName = data.get("firstName") as string;
      const lastName = data.get("lastName") as string;

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
          placeholder="First Name"
          name="firstName"
          type="text"
          className="TextField"
        />

        <input
          required
          placeholder="Last Name"
          name="lastName"
          type="text"
          className="TextField"
        />

        <input
          required
          placeholder="Your Password"
          name="password"
          type="password"
          className="TextField"
        />

        {error ? <span>{error}</span> : null}

        <button disabled={auth.loading}>Sign Up</button>
      </div>
    </form>
  );
}

export default EmailSignUpForm;
