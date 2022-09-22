import { FirebaseError } from "firebase/app";
import { UserCredential } from "firebase/auth";
import { useCallback, useState } from "react";

type AuthRequestState = {
  data: UserCredential | undefined;
  loading: boolean;
  success: boolean;
  error: FirebaseError | undefined;
};

export function useAuthRequestState() {
  const [state, setState] = useState<AuthRequestState>({
    loading: false,
    success: false,
    error: undefined,
    data: undefined,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState({
      loading,
      success: false,
      data: undefined,
      error: undefined,
    });
  }, []);

  const setData = useCallback((data: UserCredential) => {
    setState({
      data,
      success: true,
      loading: false,
      error: undefined,
    });
  }, []);

  const setError = useCallback((error: FirebaseError) => {
    setState({
      data: undefined,
      loading: false,
      success: false,
      error,
    });
  }, []);

  return {
    state,
    setState,
    setLoading,
    setData,
    setError,
  };
}
