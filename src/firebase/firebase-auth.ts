import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useCallback, useState } from "react";
import { useAuth } from "reactfire";

export function useSignUpWithEmailAndPassword() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserCredential | undefined>(undefined);
  const [error, setError] = useState<FirebaseError | undefined>(undefined);

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

  return [signUp, loading, data, error];
}
