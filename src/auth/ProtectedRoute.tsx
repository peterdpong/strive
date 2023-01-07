import { useRouter } from "next/router";
import React from "react";
import { FullPageLoading } from "../../components/shared/FullPageLoading";
import { useAuth } from "./auth";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { useRequiredAuth, loading } = useAuth();
  const auth = useRequiredAuth();
  const router = useRouter();

  if (typeof window !== "undefined") {
    if (!auth && !loading) {
      router.replace("/login");
      return (
        <div>
          <FullPageLoading />
        </div>
      );
    } else if (loading) {
      return (
        <div>
          <FullPageLoading />
        </div>
      );
    }

    return <>{children}</>;
  }

  return <></>;
}
