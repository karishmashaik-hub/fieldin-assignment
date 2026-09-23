"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { useWallet } from "@/hooks/useRewards";

const SOURCE_LABEL: Record<string, string> = {
  rvm: "RVM Redemption",
  booking: "Venue Booking",
  voucher: "Voucher Redeemed",
  bonus: "Bonus",
};

export function TransactionHistory() {
  const { data, isLoading, isError, refetch } = useWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Could not load transaction history." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-primary">Transaction History</h3>
      {data && data.transactions.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-text-primary/60">
          No coin activity yet. Redeem an RVM code to get started.
        </p>
      )}
      {data && data.transactions.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {data.transactions.map((txn, i) => (
            <div
              key={txn.id}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div>
                <p className="text-text-primary">{SOURCE_LABEL[txn.source] ?? txn.source}</p>
                <p className="text-xs text-text-primary/50">
                  {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`font-semibold ${txn.type === "earned" ? "text-emerald" : "text-red-400"}`}>
                {txn.type === "earned" ? "+" : "-"}
                {txn.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
