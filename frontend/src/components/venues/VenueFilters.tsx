"use client";

import { SPORTS } from "@/types";
import type { VenueFilterState } from "@/hooks/useVenues";

interface VenueFiltersProps {
  filters: VenueFilterState;
  onChange: (filters: VenueFilterState) => void;
}

export function VenueFilters({ filters, onChange }: VenueFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <label className="mb-1 block text-xs text-text-primary/60">Sport</label>
        <select
          value={filters.sport}
          onChange={(e) => onChange({ ...filters, sport: e.target.value })}
          className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
        >
          <option value="">All sports</option>
          {SPORTS.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-primary/60">Distance</label>
        <select
          value={filters.maxDistance}
          onChange={(e) => onChange({ ...filters, maxDistance: e.target.value })}
          className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
        >
          <option value="">Any distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="20">Within 20 km</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-primary/60">Min ₹/hr</label>
        <input
          type="number"
          min={0}
          value={filters.minPrice}
          onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          placeholder="0"
          className="w-24 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-primary/60">Max ₹/hr</label>
        <input
          type="number"
          min={0}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          placeholder="No limit"
          className="w-28 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
        />
      </div>

      {(filters.sport || filters.maxDistance || filters.minPrice || filters.maxPrice) && (
        <button
          onClick={() => onChange({ sport: "", maxDistance: "", minPrice: "", maxPrice: "" })}
          className="rounded-2xl border border-border px-3 py-2 text-xs text-text-primary/70"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
