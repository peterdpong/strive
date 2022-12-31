import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { FirebaseAppProvider, AuthProvider } from "reactfire";
import { firebaseApp } from "../src/firebase/firebase";

function App({ Component, pageProps }: AppProps) {
  const auth = initializeAuth(firebaseApp, {
    persistence: indexedDBLocalPersistence,
  });

  return (
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <AuthProvider sdk={auth}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
