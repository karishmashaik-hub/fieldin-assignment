"use client";

import { useState } from "react";
import { ChevronDownIcon, LocationPinIcon } from "@/components/shared/icons";
import { DEMO_LOCATIONS, useUiStore } from "@/store/useUiStore";

export function LocationSelector() {
  const location = useUiStore((state) => state.location);
  const setLocation = useUiStore((state) => state.setLocation);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-1.5 text-xs text-text-primary"
      >
        <LocationPinIcon className="h-3.5 w-3.5 text-emerald" />
        <span className="max-w-[10rem] truncate">{location.label}</span>
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-lg">
            {DEMO_LOCATIONS.map((loc) => (
              <button
                key={loc.label}
                onClick={() => {
                  setLocation(loc);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm ${
                  loc.label === location.label
                    ? "bg-background text-emerald"
                    : "text-text-primary hover:bg-background"
                }`}
              >
                <LocationPinIcon className="h-3.5 w-3.5" />
                {loc.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
