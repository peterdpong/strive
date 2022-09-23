import { signOut } from "firebase/auth";
import { useCallback } from "react";
import { useAuth } from "reactfire";

const SignOutButton = () => {
  const auth = useAuth();

  const onSignOutRequest = useCallback(() => {
    return signOut(auth);
  }, [auth]);

  return <button onClick={onSignOutRequest}>Sign Out</button>;
};

export default SignOutButton;
