"use client";

import { useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { CalendarIcon, CheckIcon, StarIcon } from "@/components/shared/icons";
import { useToast } from "@/components/shared/ToastProvider";
import { ApiClientError } from "@/lib/apiClient";
import { useJoinSquad } from "@/hooks/useMatchmaking";
import { useAuthStore } from "@/store/useAuthStore";
import type { SquadRequest } from "@/types";

interface SquadRequestCardProps {
  squad: SquadRequest;
}

export function SquadRequestCard({ squad }: SquadRequestCardProps) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const joinSquad = useJoinSquad();
  const [requestSent, setRequestSent] = useState(false);

  const isFull = squad.slotsFilled >= squad.slotsTotal;
  const isOwnSquad = user?.id === squad.captainId;

  async function handleRequestToJoin() {
    if (!user) {
      showToast("Please log in to request to join a squad", "error");
      return;
    }
    try {
      await joinSquad.mutateAsync(squad.id);
      setRequestSent(true);
      showToast(`Request sent to ${squad.captainName}!`, "success");
    } catch (err) {
      showToast(err instanceof ApiClientError ? err.message : "Could not send join request.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{squad.captainName}</h3>
          <p className="text-xs text-text-primary/60">
            {squad.sportType}
            {squad.venueName ? ` · ${squad.venueName}` : ""}
          </p>
        </div>
        <Badge variant="amber">
          <StarIcon className="h-3 w-3" />
          {squad.captainTrustScore.toFixed(1)} Trust
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge>
          <CalendarIcon className="h-3 w-3" />
          {new Date(squad.slotDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {squad.slotStart}
        </Badge>
        <Badge>Total ₹{squad.totalCost}</Badge>
        <Badge variant="emerald">₹{squad.perHeadCost}/head</Badge>
      </div>

      <ProgressBar value={squad.slotsFilled} max={squad.slotsTotal} label="Slots filled" />

      <button
        onClick={handleRequestToJoin}
        disabled={requestSent || isFull || isOwnSquad || joinSquad.isPending}
        className={`flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-medium transition-transform active:scale-95 disabled:cursor-not-allowed ${
          requestSent
            ? "border border-emerald text-emerald"
            : "bg-emerald text-background disabled:opacity-50"
        }`}
      >
        {requestSent && <CheckIcon className="h-3.5 w-3.5" />}
        {isOwnSquad
          ? "Your Squad"
          : isFull && !requestSent
            ? "Squad Full"
            : requestSent
              ? "Request Sent"
              : "Request to Join"}
      </button>
    </div>
  );
}
