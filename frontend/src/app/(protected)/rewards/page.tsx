"use client";

import Link from "next/link";
import { CoinIcon } from "@/components/shared/icons";
import { RewardsStore } from "@/components/rewards/RewardsStore";
import { RvmBanner } from "@/components/rewards/RvmBanner";
import { RvmRedeemer } from "@/components/rewards/RvmRedeemer";
import { TransactionHistory } from "@/components/rewards/TransactionHistory";
import { useAuthStore } from "@/store/useAuthStore";

export default function RewardsPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <main className="mx-auto max-w-md space-y-4 p-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-text-primary">Log in to see your Rewards</h1>
        <p className="text-sm text-text-primary/60">Your coin wallet, RVM redemptions, and rewards store live here.</p>
        <Link href="/login" className="inline-block rounded-2xl bg-emerald px-5 py-2.5 text-sm font-medium text-background">
          Log in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex items-center justify-between rounded-2xl border border-amber/40 bg-card p-5">
        <div>
          <p className="text-xs text-text-primary/60">Your coin wallet</p>
          <p className="mt-1 flex items-center gap-2 text-3xl font-bold text-amber">
            <CoinIcon className="h-7 w-7" />
            {user.coinsBalance}
          </p>
        </div>
      </div>

      <RvmBanner />
      <RvmRedeemer />
      <RewardsStore />
      <TransactionHistory />
    </main>
  );
}
