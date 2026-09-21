"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { apiFetch, ApiClientError } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("aditya@fieldin.dev");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.user, data.token);
      showToast(`Welcome back, ${data.user.name.split(" ")[0]}!`, "success");
      router.push("/venues");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold text-text-primary">Log in to FieldIn</h1>
      <p className="mb-6 text-sm text-text-primary/60">
        Demo accounts are pre-seeded — see the README for the full list.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-xs text-text-primary/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-primary/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {loading && <Spinner />}
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-text-primary/60">
        No account?{" "}
        <Link href="/register" className="text-emerald">
          Register
        </Link>
      </p>
    </main>
  );
}
