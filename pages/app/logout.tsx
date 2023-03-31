import ProtectedRoute from "../../src/auth/ProtectedRoute";
import { FullPageLoading } from "../../components/shared/FullPageLoading";
import { useAuth } from "../../src/auth/auth";
import { useEffect } from "react";

export default function Logout() {
  const { signOutAuth } = useAuth();

  useEffect(() => {
    signOutAuth();
  }, [signOutAuth]);

  return (
    <ProtectedRoute>
      <FullPageLoading />
    </ProtectedRoute>
  );
}
