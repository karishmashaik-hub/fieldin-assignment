import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import type { CoinTransaction, Voucher } from "@/types";

export function useWallet() {
  return useQuery({
    queryKey: ["rewards", "wallet"],
    queryFn: () => apiFetch<{ balance: number; transactions: CoinTransaction[] }>("/rewards/wallet"),
  });
}

export function useVouchers() {
  return useQuery({
    queryKey: ["rewards", "vouchers"],
    queryFn: () => apiFetch<{ vouchers: Voucher[] }>("/rewards/vouchers"),
  });
}

export function useRedeemCode() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (code: string) =>
      apiFetch<{ balance: number; transaction: CoinTransaction }>("/rewards/redeem-code", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    onSuccess: (data) => {
      updateUser({ coinsBalance: data.balance });
      queryClient.invalidateQueries({ queryKey: ["rewards", "wallet"] });
    },
  });
}

/** Keeps the header's coin badge live across tabs/devices for the same
 * account: the backend broadcasts on every redemption, and this filters
 * down to events for the currently signed-in user. */
export function useWalletSocket() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const currentUserId = user.id;

    const handleWalletUpdate = (payload: { userId: string; balance: number }) => {
      if (payload.userId !== currentUserId) return;
      updateUser({ coinsBalance: payload.balance });
      queryClient.invalidateQueries({ queryKey: ["rewards", "wallet"] });
    };

    socket.on("rewards:wallet:updated", handleWalletUpdate);
    return () => {
      socket.off("rewards:wallet:updated", handleWalletUpdate);
    };
  }, [user, updateUser, queryClient]);
}

export function useRedeemVoucher() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (voucherId: string) =>
      apiFetch<{ balance: number; transaction: CoinTransaction; voucher: { id: string; title: string } }>(
        "/rewards/redeem-voucher",
        { method: "POST", body: JSON.stringify({ voucherId }) }
      ),
    onSuccess: (data) => {
      updateUser({ coinsBalance: data.balance });
      queryClient.invalidateQueries({ queryKey: ["rewards", "wallet"] });
    },
  });
}
