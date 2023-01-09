import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FullPageLoading } from "../../components/shared/FullPageLoading";
import { useAuth } from "./auth";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { useRequiredAuth, loading } = useAuth();
  const auth = useRequiredAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!auth && !loading) {
        router.replace("/login");
      }
    }
  });

  if ((!auth && !loading) || loading) {
    return (
      <div>
        <FullPageLoading />
      </div>
    );
  }

  return <>{children}</>;
}
