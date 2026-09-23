"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/shared/Spinner";
import { useAuthStore } from "@/store/useAuthStore";

/** Wraps the protected route group. Renders nothing (past a loading spinner)
 * until the initial session check (providers.tsx's AuthHydrator) resolves,
 * then redirects to /login if there's no authenticated user. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authChecked = useAuthStore((state) => state.authChecked);

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  if (!authChecked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
