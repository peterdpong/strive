import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { FirebaseAppProvider, AuthProvider } from "reactfire";

import config from "~config";

function App({ Component, pageProps }: AppProps) {
  const app = initializeApp(config.firebase);
  const auth = initializeAuth(app);

  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
