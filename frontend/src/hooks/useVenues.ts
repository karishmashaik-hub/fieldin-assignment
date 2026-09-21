import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { Venue } from "@/types";

export interface VenueFilterState {
  sport: string;
  maxDistance: string;
  minPrice: string;
  maxPrice: string;
}

export function useVenues(filters: VenueFilterState, lat: number, lng: number) {
  const params = new URLSearchParams();
  if (filters.sport) params.set("sport", filters.sport);
  if (filters.maxDistance) params.set("maxDistance", filters.maxDistance);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  params.set("lat", String(lat));
  params.set("lng", String(lng));

  return useQuery({
    queryKey: ["venues", filters, lat, lng],
    queryFn: () => apiFetch<{ venues: Venue[] }>(`/venues?${params.toString()}`),
  });
}
