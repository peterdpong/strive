import { useAuth } from "../src/auth/auth";
const SignOutButton = () => {
  const { signOutAuth } = useAuth();

  return <button onClick={signOutAuth}>Sign Out</button>;
};

export default SignOutButton;
