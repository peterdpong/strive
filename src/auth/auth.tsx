// TODO(Peter): Default context being is annoying
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, DocumentSnapshot, onSnapshot } from "firebase/firestore";
import {
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authInstance, firestoreDB } from "../firebase/firebase";
import { addNewUser, getUserData } from "../firebase/UserActions";
import { UserModel } from "../models/UserModel";

interface AuthContext {
  useRequiredAuth: () => UserModel | null;
  loading: boolean;
  signinEmail: (email: string, password: string) => Promise<void>;
  createUserEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ) => Promise<void>;
  signOutAuth: () => Promise<void>;
}

const authContext: Context<AuthContext> = createContext<AuthContext>({
  useRequiredAuth: () => {
    return null;
  },
  loading: true,
  signinEmail: async (email: string, password: string) => {},
  createUserEmail: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ) => {},
  signOutAuth: async () => {},
});

const formatUserState = (userData: DocumentSnapshot): UserModel | null => {
  console.log(userData);

  if (userData.data() === undefined) {
    return null;
  }

  return {
    uid: userData?.get("uid"),
    email: userData?.get("email"),
    firstName: userData?.get("firstName"),
    lastName: userData?.get("lastName"),
    age: userData?.get("age"),
    onboardingStatus: userData?.get("onboardingStatus"),
    financialInfo: userData?.get("financialInfo"),
    budgetInfo: userData?.get("budgetInfo"),
    goalInfo: userData?.get("goalInfo"),
    monthTransactionsMap: userData?.get("monthTransactionsMap"),
    suggestions: userData?.get("suggestions"),
  };
};

function useProvideAuth() {
  const [auth, setAuth] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAuthChange = async (authState: User | null) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    const userData = await getUserData(authState.uid);

    if (!userData) {
      console.error("handleAuthChange error: userData null");
      setLoading(false);
      return;
    }

    setAuth(userData);
    setLoading(false);
  };

  const clearAuthState = () => {
    setAuth(null);
    setLoading(true);
  };

  const signinEmail = (email: string, password: string) => {
    setLoading(true);

    return signInWithEmailAndPassword(authInstance, email, password)
      .then(async (response: UserCredential) => {
        if (!response.user) {
          throw new Error("No User");
        }

        const userData = await getUserData(response.user.uid);
        console.log(userData);
        if (userData === undefined) {
          console.error("Email Signin Error: userData null");
          setLoading(false);
          return;
        }

        setAuth(userData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw new Error(error.message);
      });
  };

  const createUserEmail = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ) => {
    return createUserWithEmailAndPassword(authInstance, email, password).then(
      async (response: UserCredential) => {
        setLoading(true);

        if (!response.user) {
          throw new Error("No User");
        }

        const userData = await addNewUser(
          response.user.uid,
          email,
          firstName,
          lastName,
          age
        );
        setAuth(userData);

        setLoading(false);
      }
    );
  };

  const signOutAuth = async () => {
    return signOut(authInstance).then(clearAuthState);
  };

  const useRequiredAuth = () => {
    // const router = useRouter();

    // useEffect(() => {
    //   if(!auth && !loading) {
    //     router.push('/signin');
    //   }

    // }, [auth, router]);

    return auth;
  };

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (auth?.uid) {
      const unsubscribe = onSnapshot(
        doc(firestoreDB, "users", auth.uid),
        (doc) => setAuth(formatUserState(doc))
      );

      return () => unsubscribe();
    }
  }, [loading, auth?.uid]);

  return {
    useRequiredAuth,
    loading,
    signinEmail,
    createUserEmail,
    signOutAuth,
  };
}

interface AuxProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuxProps) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
