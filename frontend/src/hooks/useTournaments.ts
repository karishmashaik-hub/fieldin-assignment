import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { Tournament } from "@/types";

export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: () => apiFetch<{ tournaments: Tournament[] }>("/tournaments"),
  });
}

export function useRegisterTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tournamentId, teamName }: { tournamentId: string; teamName: string }) =>
      apiFetch<{ tournament: Tournament }>(`/tournaments/${tournamentId}/register`, {
        method: "POST",
        body: JSON.stringify({ teamName }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
}
