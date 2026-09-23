"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { CalendarIcon, TrophyIcon } from "@/components/shared/icons";
import { RegisterTeamModal } from "./RegisterTeamModal";
import { useUiStore } from "@/store/useUiStore";
import type { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();
  const setMatchmakingSportFilter = useUiStore((state) => state.setMatchmakingSportFilter);
  const [registerOpen, setRegisterOpen] = useState(false);
  const isFull = tournament.registeredTeams >= tournament.maxTeams;

  function handleFindMissingPlayers() {
    setMatchmakingSportFilter(tournament.sportType);
    router.push(`/matchmaking?tab=solo&sport=${encodeURIComponent(tournament.sportType)}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border text-amber">
            <TrophyIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{tournament.title}</h3>
            <p className="text-xs text-text-primary/60">
              {tournament.sportType}
              {tournament.venueName ? ` · ${tournament.venueName}` : ""}
            </p>
          </div>
        </div>
        <Badge>
          <CalendarIcon className="h-3 w-3" />
          {new Date(tournament.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="amber">Entry ₹{tournament.entryFee}</Badge>
        {tournament.prizePool > 0 && <Badge variant="emerald">Prize ₹{tournament.prizePool}</Badge>}
      </div>

      <ProgressBar value={tournament.registeredTeams} max={tournament.maxTeams} label="Teams registered" />

      <div className="mt-1 flex gap-2">
        <button
          onClick={() => setRegisterOpen(true)}
          disabled={isFull}
          className="flex-1 rounded-2xl bg-emerald px-3 py-2 text-xs font-medium text-background transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFull ? "Tournament Full" : "Register Full Team"}
        </button>
        <button
          onClick={handleFindMissingPlayers}
          className="flex-1 rounded-2xl border border-emerald px-3 py-2 text-xs font-medium text-emerald transition-transform active:scale-95"
        >
          Find Missing Players
        </button>
      </div>

      <RegisterTeamModal
        tournament={tournament}
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </div>
  );
}
