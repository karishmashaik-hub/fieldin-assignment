import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { Venue } from "@/types";

/** Unfiltered venue list (no distance/location params), used to look up
 * lat/lng for map markers rather than for the Venues tab's filtered browsing. */
export function useAllVenues() {
  return useQuery({
    queryKey: ["venues", "all"],
    queryFn: () => apiFetch<{ venues: Venue[] }>("/venues"),
  });
}
