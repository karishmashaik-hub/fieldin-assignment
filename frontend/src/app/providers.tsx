"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { apiFetch, getToken } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types";

function AuthHydrator() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<User>("/users/profile")
      .then((user) => setAuth(user, token))
      .catch(() => logout());
    // Runs once on mount to rehydrate the session from a stored token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthHydrator />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
