"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { ListIcon, MapIcon } from "@/components/shared/icons";
import { useAllVenues } from "@/hooks/useAllVenues";
import { useSquads } from "@/hooks/useMatchmaking";
import { SquadRequestCard } from "./SquadRequestCard";
import type { PickupMarker } from "./PickupMatchMapView";

const PickupMatchMapView = dynamic(() => import("./PickupMatchMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-border">
      <Spinner />
    </div>
  ),
});

const DEFAULT_CENTER: [number, number] = [12.9352, 77.6146];

export function PickupMatchesTab() {
  const [view, setView] = useState<"list" | "map">("map");
  const squads = useSquads();
  const venues = useAllVenues();

  const markers = useMemo<PickupMarker[]>(() => {
    if (!squads.data || !venues.data) return [];
    const venueById = new Map(venues.data.venues.map((v) => [v.id, v]));
    return squads.data.squads
      .map((squad) => {
        const venue = squad.venueId ? venueById.get(squad.venueId) : undefined;
        if (!venue) return null;
        return {
          id: squad.id,
          lat: venue.lat,
          lng: venue.lng,
          sportType: squad.sportType,
          venueName: venue.name,
          captainName: squad.captainName,
          slotDate: squad.slotDate,
          slotStart: squad.slotStart,
          slotsFilled: squad.slotsFilled,
          slotsTotal: squad.slotsTotal,
        };
      })
      .filter((m): m is PickupMarker => m !== null);
  }, [squads.data, venues.data]);

  const isLoading = squads.isLoading || venues.isLoading;
  const isError = squads.isError || venues.isError;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-primary/60">Open community games near you</p>
        <div className="flex rounded-2xl border border-border p-1">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs ${
              view === "map" ? "bg-emerald text-background" : "text-text-primary/70"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs ${
              view === "list" ? "bg-emerald text-background" : "text-text-primary/70"
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <ErrorState message="Could not load pickup matches." onRetry={() => squads.refetch()} />}

      {!isLoading && !isError && view === "map" && (
        <PickupMatchMapView markers={markers} center={DEFAULT_CENTER} />
      )}

      {!isLoading && !isError && view === "list" && (
        <>
          {squads.data && squads.data.squads.length === 0 && (
            <p className="py-16 text-center text-sm text-text-primary/60">No open pickup matches right now.</p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {squads.data?.squads.map((squad) => (
              <SquadRequestCard key={squad.id} squad={squad} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
