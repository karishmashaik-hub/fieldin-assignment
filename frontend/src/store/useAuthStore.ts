import { create } from "zustand";
import { setToken } from "@/lib/apiClient";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user, token) => {
    setToken(token);
    set({ user });
  },
  updateUser: (patch) => set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
  logout: () => {
    setToken(null);
    set({ user: null });
  },
}));
