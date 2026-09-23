"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { EyeIcon, EyeOffIcon } from "@/components/shared/icons";
import { apiFetch, ApiClientError } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ accessToken: string; refreshToken: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setAuth(data.user, data.accessToken, data.refreshToken);
      showToast(`Welcome to FieldIn, ${data.user.name.split(" ")[0]}!`, "success");
      router.push("/venues");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Create your FieldIn account</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-xs text-text-primary/70">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
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
          <label className="mb-1 block text-xs text-text-primary/70">Password (min 8 characters)</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2 pr-10 text-sm text-text-primary outline-none focus:border-emerald"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-text-primary/60 hover:text-text-primary"
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {loading && <Spinner />}
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-text-primary/60">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald">
          Log in
        </Link>
      </p>
    </main>
  );
}
