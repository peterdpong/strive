import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useCallback } from "react";
import { useAuth } from "reactfire";
import { addNewUser } from "../../firebase/UserActions";
import { useAuthRequestState } from "./useAuthRequestState";

export function useSignUpWithEmailAndPassword() {
  const auth = useAuth();
  const { state, setLoading, setData, setError } = useAuthRequestState();

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);

      try {
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (userCredentials: UserCredential) => {
            addNewUser(userCredentials.user.uid, "cool", "beans");
            setData(userCredentials);
          }
        );
      } catch (error) {
        setError(error as FirebaseError);
      }
    },
    [auth, setData, setLoading, setError]
  );

  return [signUp, state] as [typeof signUp, typeof state];
}
