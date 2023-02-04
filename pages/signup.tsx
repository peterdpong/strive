import { useRouter } from "next/router";
import { useCallback } from "react";
import EmailSignUpForm from "../components/EmailSignUpForm";

const SignUp = () => {
  const router = useRouter();

  const signUpCallback = useCallback(() => {
    router.push("/onboarding");
  }, [router]);

  return (
    <div>
      <EmailSignUpForm onSignUp={signUpCallback} />
    </div>
  );
};

export default SignUp;
