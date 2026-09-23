"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { useTournaments } from "@/hooks/useTournaments";

export default function TournamentsPage() {
  const { data, isLoading, isError, refetch } = useTournaments();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-semibold text-text-primary">Community Tournaments</h1>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <ErrorState message="Could not load tournaments." onRetry={() => refetch()} />}

      {!isLoading && !isError && data?.tournaments.length === 0 && (
        <p className="py-16 text-center text-sm text-text-primary/60">No tournaments are open right now.</p>
      )}

      {!isLoading && !isError && data && data.tournaments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </main>
  );
}
