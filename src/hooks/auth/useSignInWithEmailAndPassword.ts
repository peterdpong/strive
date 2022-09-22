import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
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
        const credentials = await signInWithEmailAndPassword(
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

  return [signIn, state] as [typeof signIn, typeof state];
}
