import { create } from "zustand";
import { setRefreshToken, setToken } from "@/lib/apiClient";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  /** True once the initial token-rehydration check (see providers.tsx) has
   * resolved, whether it found a valid session or not. Route guards wait for
   * this before deciding to redirect, so a valid session isn't bounced to
   * /login while its profile fetch is still in flight. */
  authChecked: boolean;
  /** refreshToken is omitted when rehydrating an already-stored session
   * (see providers.tsx's AuthHydrator) — there's no new refresh token to
   * persist in that case, so the one already in storage is left untouched. */
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
  markAuthChecked: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authChecked: false,
  setAuth: (user, accessToken, refreshToken) => {
    setToken(accessToken);
    if (refreshToken) setRefreshToken(refreshToken);
    set({ user, authChecked: true });
  },
  updateUser: (patch) => set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
  logout: () => {
    setToken(null);
    setRefreshToken(null);
    set({ user: null, authChecked: true });
  },
  markAuthChecked: () => set({ authChecked: true }),
}));
