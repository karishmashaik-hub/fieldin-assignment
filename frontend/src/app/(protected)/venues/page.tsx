"use client";

import { useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Spinner } from "@/components/shared/Spinner";
import { BookingDrawer } from "@/components/venues/BookingDrawer";
import { VenueCard } from "@/components/venues/VenueCard";
import { VenueFilters } from "@/components/venues/VenueFilters";
import { useVenues, type VenueFilterState } from "@/hooks/useVenues";
import { useUiStore } from "@/store/useUiStore";
import type { Venue } from "@/types";

const EMPTY_FILTERS: VenueFilterState = { sport: "", maxDistance: "", minPrice: "", maxPrice: "" };

export default function VenuesPage() {
  const location = useUiStore((state) => state.location);
  const [filters, setFilters] = useState<VenueFilterState>(EMPTY_FILTERS);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const { data, isLoading, isError, refetch } = useVenues(filters, location.lat, location.lng);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-semibold text-text-primary">Venues near {location.label}</h1>
      <VenueFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <ErrorState message="Could not load venues." onRetry={() => refetch()} />}

      {!isLoading && !isError && data?.venues.length === 0 && (
        <p className="py-16 text-center text-sm text-text-primary/60">
          No venues match these filters. Try widening your search.
        </p>
      )}

      {!isLoading && !isError && data && data.venues.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onBookSlot={setSelectedVenue} />
          ))}
        </div>
      )}

      <BookingDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </main>
  );
}
