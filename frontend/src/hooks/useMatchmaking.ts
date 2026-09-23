import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { getSocket } from "@/lib/socket";
import type { SoloAvailability, SquadRequest } from "@/types";

export function useSquads() {
  return useQuery({
    queryKey: ["matchmaking", "squads"],
    queryFn: () => apiFetch<{ squads: SquadRequest[] }>("/matchmaking/squads"),
  });
}

export function useSolo() {
  return useQuery({
    queryKey: ["matchmaking", "solo"],
    queryFn: () => apiFetch<{ solo: SoloAvailability[] }>("/matchmaking/solo"),
  });
}

interface PostSquadInput {
  kind: "squad";
  venueId: string;
  sportType: string;
  slotDate: string;
  slotStart: string;
  totalCost: number;
  slotsTotal: number;
}

interface PostSoloInput {
  kind: "solo";
  sportType: string;
  availableDate: string;
  availableTime: string;
  maxBudget?: number;
  notes?: string;
}

export function usePostMatchmaking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PostSquadInput | PostSoloInput) =>
      apiFetch<{ squad?: SquadRequest; solo?: SoloAvailability }>("/matchmaking/post", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matchmaking", variables.kind === "squad" ? "squads" : "solo"] });
    },
  });
}

export function useJoinSquad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (squadId: string) =>
      apiFetch<{ squad: SquadRequest }>(`/matchmaking/join/${squadId}`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchmaking", "squads"] });
    },
  });
}

/** Keeps the squads/solo query caches live across all connected clients. */
export function useMatchmakingSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const refreshSquads = () => queryClient.invalidateQueries({ queryKey: ["matchmaking", "squads"] });
    const refreshSolo = () => queryClient.invalidateQueries({ queryKey: ["matchmaking", "solo"] });

    socket.on("matchmaking:squad:new", refreshSquads);
    socket.on("matchmaking:squad:updated", refreshSquads);
    socket.on("matchmaking:solo:new", refreshSolo);

    return () => {
      socket.off("matchmaking:squad:new", refreshSquads);
      socket.off("matchmaking:squad:updated", refreshSquads);
      socket.off("matchmaking:solo:new", refreshSolo);
    };
  }, [queryClient]);
}
