import { useEffect } from "react";
import { useAuth, useSigninCheck } from "reactfire";

export default function ProtectedPage({
  children,
  whenSignedOut,
}: React.PropsWithChildren<{ whenSignedOut?: string }>) {
  const auth = useAuth();
  const { status } = useSigninCheck();

  useEffect(() => {
    if (status != "success") return;

    const listener = auth.onAuthStateChanged((user) => {
      const shouldLogOut = !user && whenSignedOut;

      if (shouldLogOut) {
        const path = window.location.pathname;

        if (path !== whenSignedOut) {
          window.location.assign(whenSignedOut);
        }
      }
    });

    // Destroy listener
    return () => listener();
  }, [auth, status, whenSignedOut]);

  console.log(status, auth);

  // Note: Checking both of these to determine the loading make sure we don't render the children before we redirect on no login.
  const loadingOrNoUser = status !== "success" || !auth.currentUser;

  return loadingOrNoUser ? (
    <>
      <h1>Loading</h1>
    </>
  ) : (
    <>{children}</>
  );
}
