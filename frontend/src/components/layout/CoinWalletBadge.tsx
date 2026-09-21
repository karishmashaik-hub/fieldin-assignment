"use client";

import { useRouter } from "next/navigation";
import { CoinIcon } from "@/components/shared/icons";
import { useAuthStore } from "@/store/useAuthStore";

export function CoinWalletBadge() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <button
      onClick={() => router.push("/rewards")}
      className="flex items-center gap-1.5 rounded-2xl border border-amber px-3 py-1.5 text-xs font-medium text-amber transition-transform active:scale-95"
    >
      <CoinIcon className="h-3.5 w-3.5" />
      <span data-testid="coin-balance">{user.coinsBalance}</span>
    </button>
  );
}
