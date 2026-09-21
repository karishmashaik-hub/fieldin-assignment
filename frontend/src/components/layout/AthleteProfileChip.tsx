"use client";

import { useState } from "react";
import { CloseIcon, UserIcon } from "@/components/shared/icons";
import { useAuthStore } from "@/store/useAuthStore";

export function AthleteProfileChip() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-2xl border border-border px-2.5 py-1.5 text-xs text-text-primary"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald/20 text-emerald">
          <UserIcon className="h-3 w-3" />
        </span>
        <span className="max-w-[6rem] truncate">{user.name.split(" ")[0]}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{user.name}</h2>
                <p className="text-xs text-text-primary/60">{user.email}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-text-primary/60">
                <CloseIcon />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-border p-3">
                <p className="text-lg font-semibold text-emerald">{user.trustScore.toFixed(1)}</p>
                <p className="text-[10px] text-text-primary/60">Trust Score</p>
              </div>
              <div className="rounded-2xl border border-border p-3">
                <p className="text-lg font-semibold text-emerald">{user.punctualityRate.toFixed(0)}%</p>
                <p className="text-[10px] text-text-primary/60">On-time</p>
              </div>
              <div className="rounded-2xl border border-border p-3">
                <p className="text-lg font-semibold text-amber">{user.coinsBalance}</p>
                <p className="text-[10px] text-text-primary/60">Coins</p>
              </div>
            </div>

            {user.sportPreferences.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs text-text-primary/60">Sports</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.sportPreferences.map((sport) => (
                    <span key={sport} className="rounded-2xl border border-border px-2.5 py-1 text-xs">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="mt-6 w-full rounded-2xl border border-border py-2 text-sm text-text-primary/80"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
