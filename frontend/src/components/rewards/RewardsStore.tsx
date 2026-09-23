"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { CoinIcon, GiftIcon } from "@/components/shared/icons";
import { ApiClientError } from "@/lib/apiClient";
import { useRedeemVoucher, useVouchers } from "@/hooks/useRewards";
import { useAuthStore } from "@/store/useAuthStore";

export function RewardsStore() {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useVouchers();
  const redeemVoucher = useRedeemVoucher();

  async function handleRedeem(voucherId: string, coinCost: number, title: string) {
    if (!user) {
      showToast("Please log in to redeem vouchers", "error");
      return;
    }
    if (user.coinsBalance < coinCost) {
      showToast(`Not enough coins — you need ${coinCost - user.coinsBalance} more.`, "error");
      return;
    }

    try {
      await redeemVoucher.mutateAsync(voucherId);
      showToast(`Redeemed "${title}"!`, "success");
    } catch (err) {
      showToast(err instanceof ApiClientError ? err.message : "Could not redeem this voucher.", "error");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Could not load the rewards store." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-primary">Rewards Store</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.vouchers.map((voucher) => {
          const canAfford = (user?.coinsBalance ?? 0) >= voucher.coinCost;
          return (
            <div key={voucher.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border text-amber">
                  <GiftIcon className="h-4 w-4" />
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-amber">
                  <CoinIcon className="h-3.5 w-3.5" />
                  {voucher.coinCost}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{voucher.title}</h4>
                {voucher.description && <p className="mt-1 text-xs text-text-primary/60">{voucher.description}</p>}
              </div>
              <button
                onClick={() => handleRedeem(voucher.id, voucher.coinCost, voucher.title)}
                disabled={!canAfford || redeemVoucher.isPending}
                className="mt-auto rounded-2xl bg-emerald px-4 py-2 text-xs font-medium text-background transition-transform active:scale-95 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-primary/40"
              >
                {canAfford ? "Redeem" : "Not enough coins"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
