import { useRouter } from "next/router";
import { useCallback } from "react";
import EmailSignInForm from "../components/EmailSignInForm";

const SignIn = () => {
  const router = useRouter();

  const signInCallback = useCallback(() => {
    router.push("/app");
  }, [router]);

  return (
    <div>
      <h1>Sign In</h1>
      <EmailSignInForm onSignUp={signInCallback} />
    </div>
  );
};

export default SignIn;
