import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback } from "react";
import { useAuth } from "reactfire";
import { useAuthRequestState } from "./useAuthRequestState";

export function useSignUpWithEmailAndPassword() {
  const auth = useAuth();
  const { state, setLoading, setData, setError } = useAuthRequestState();

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);

      try {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        setData(credentials);
      } catch (error) {
        setError(error as FirebaseError);
      }
    },
    [auth, setData, setLoading, setError]
  );

  return [signUp, state] as [typeof signUp, typeof state];
}
