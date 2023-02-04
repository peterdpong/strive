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
      <EmailSignInForm onSignUp={signInCallback} />
    </div>
  );
};

export default SignIn;
