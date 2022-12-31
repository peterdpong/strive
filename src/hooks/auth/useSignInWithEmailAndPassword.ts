import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useCallback } from "react";
import { useAuth } from "reactfire";
import { useAuthRequestState } from "./useAuthRequestState";

export function useSignInWithEmailAndPassword() {
  const auth = useAuth();
  const { state, setLoading, setData, setError } = useAuthRequestState();

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);

      try {
        await signInWithEmailAndPassword(auth, email, password).then(
          (userCredentials: UserCredential) => {
            setData(userCredentials);
          }
        );
      } catch (error) {
        setError(error as FirebaseError);
      }
    },
    [auth, setData, setLoading, setError]
  );

  return [signIn, state] as [typeof signIn, typeof state];
}
