"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { apiFetch, getToken } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import type { User } from "@/types";

function AuthHydrator() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const markAuthChecked = useAuthStore((state) => state.markAuthChecked);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      markAuthChecked();
      return;
    }

    apiFetch<User>("/users/profile")
      .then((user) => setAuth(user, token))
      .catch(() => logout());
    // Runs once on mount to rehydrate the session from a stored token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // apiClient dispatches this when a background request's 401 can't be
    // recovered by refreshing (refresh token missing/invalid/expired) — it
    // has no store access itself, so it signals via a DOM event instead.
    function handleSessionExpired() {
      logout();
    }
    window.addEventListener("fieldin:session-expired", handleSessionExpired);
    return () => window.removeEventListener("fieldin:session-expired", handleSessionExpired);
  }, [logout]);

  return null;
}

function ThemeHydrator() {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem("fieldin-theme");
    setTheme(stored === "light" ? "light" : "dark");
    // Runs once on mount to sync store state with the persisted preference
    // (the DOM attribute itself is already set synchronously in layout.tsx
    // to avoid a flash of the wrong theme).
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
        <ThemeHydrator />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
