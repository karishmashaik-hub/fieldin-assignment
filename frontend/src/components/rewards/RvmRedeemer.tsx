"use client";

import { useState } from "react";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { CoinIcon } from "@/components/shared/icons";
import { ApiClientError } from "@/lib/apiClient";
import { useRedeemCode } from "@/hooks/useRewards";

export function RvmRedeemer() {
  const { showToast } = useToast();
  const redeemCode = useRedeemCode();
  const [code, setCode] = useState("");
  const [justRedeemed, setJustRedeemed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const result = await redeemCode.mutateAsync(code);
      showToast(`+${result.transaction.amount} coins added! Balance: ${result.balance}`, "success");
      setJustRedeemed(true);
      setCode("");
      setTimeout(() => setJustRedeemed(false), 1200);
    } catch (err) {
      showToast(err instanceof ApiClientError ? err.message : "Could not redeem this code.", "error");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">Redeem an RVM Code</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. RVM-2026"
          className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm uppercase text-text-primary outline-none focus:border-emerald"
        />
        <button
          type="submit"
          disabled={redeemCode.isPending || !code.trim()}
          className={`flex items-center gap-1.5 rounded-2xl bg-amber px-4 py-2 text-xs font-medium text-background transition-transform disabled:opacity-50 ${
            justRedeemed ? "scale-110" : "active:scale-95"
          }`}
        >
          {redeemCode.isPending ? <Spinner /> : <CoinIcon className="h-3.5 w-3.5" />}
          Redeem Code
        </button>
      </form>
    </div>
  );
}
