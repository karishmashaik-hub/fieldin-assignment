"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { AthleteResumeDrawer } from "@/components/matchmaking/AthleteResumeDrawer";
import { PickupMatchesTab } from "@/components/matchmaking/PickupMatchesTab";
import { PostAvailabilityModal } from "@/components/matchmaking/PostAvailabilityModal";
import { SoloPlayerCard } from "@/components/matchmaking/SoloPlayerCard";
import { SquadRequestCard } from "@/components/matchmaking/SquadRequestCard";
import { useMatchmakingSocket, useSolo, useSquads } from "@/hooks/useMatchmaking";
import { useUiStore } from "@/store/useUiStore";
import type { SoloAvailability } from "@/types";

type SubTab = "squads" | "solo" | "pickup";

const TABS: { key: SubTab; label: string }[] = [
  { key: "squads", label: "Squad Requests" },
  { key: "solo", label: "Solo Players Hub" },
  { key: "pickup", label: "Open Pickup Matches" },
];

export default function MatchmakingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner /></div>}>
      <MatchmakingPageInner />
    </Suspense>
  );
}

function MatchmakingPageInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SubTab | null) ?? "squads";
  const sportFilterParam = searchParams.get("sport");

  const setMatchmakingSportFilter = useUiStore((state) => state.setMatchmakingSportFilter);
  const matchmakingSportFilter = useUiStore((state) => state.matchmakingSportFilter);

  const [activeTab, setActiveTab] = useState<SubTab>(initialTab);
  const [selectedAthlete, setSelectedAthlete] = useState<SoloAvailability | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  useMatchmakingSocket();

  useEffect(() => {
    if (sportFilterParam) {
      setMatchmakingSportFilter(sportFilterParam);
    }
  }, [sportFilterParam, setMatchmakingSportFilter]);

  const squads = useSquads();
  const solo = useSolo();

  const filteredSquads = useMemo(() => {
    if (!squads.data) return [];
    if (!matchmakingSportFilter) return squads.data.squads;
    return squads.data.squads.filter((s) => s.sportType === matchmakingSportFilter);
  }, [squads.data, matchmakingSportFilter]);

  const filteredSolo = useMemo(() => {
    if (!solo.data) return [];
    if (!matchmakingSportFilter) return solo.data.solo;
    return solo.data.solo.filter((s) => s.sportType === matchmakingSportFilter);
  }, [solo.data, matchmakingSportFilter]);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text-primary">Live Matchmaking</h1>
        <button
          onClick={() => setPostOpen(true)}
          className="rounded-2xl bg-emerald px-4 py-2 text-xs font-medium text-background transition-transform active:scale-95"
        >
          + Post Availability
        </button>
      </div>

      {matchmakingSportFilter && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald bg-emerald/10 px-4 py-2 text-xs text-emerald">
          Filtering by {matchmakingSportFilter}
          <button onClick={() => setMatchmakingSportFilter(null)} className="underline">
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-emerald text-emerald"
                : "border-transparent text-text-primary/60 hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "squads" && (
        <div className="space-y-4">
          {squads.isLoading && (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          )}
          {squads.isError && <ErrorState message="Could not load squad requests." onRetry={() => squads.refetch()} />}
          {!squads.isLoading && !squads.isError && filteredSquads.length === 0 && (
            <p className="py-16 text-center text-sm text-text-primary/60">No open squad requests right now.</p>
          )}
          {!squads.isLoading && !squads.isError && filteredSquads.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSquads.map((squad) => (
                <SquadRequestCard key={squad.id} squad={squad} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "solo" && (
        <div className="space-y-4">
          {solo.isLoading && (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          )}
          {solo.isError && <ErrorState message="Could not load solo players." onRetry={() => solo.refetch()} />}
          {!solo.isLoading && !solo.isError && filteredSolo.length === 0 && (
            <p className="py-16 text-center text-sm text-text-primary/60">No solo players are looking to play right now.</p>
          )}
          {!solo.isLoading && !solo.isError && filteredSolo.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSolo.map((athlete) => (
                <SoloPlayerCard key={athlete.id} athlete={athlete} onInvite={setSelectedAthlete} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "pickup" && <PickupMatchesTab />}

      <AthleteResumeDrawer athlete={selectedAthlete} onClose={() => setSelectedAthlete(null)} />
      <PostAvailabilityModal open={postOpen} onClose={() => setPostOpen(false)} />
    </main>
  );
}
