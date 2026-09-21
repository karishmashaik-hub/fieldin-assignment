"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { AthleteProfileChip } from "./AthleteProfileChip";
import { CoinWalletBadge } from "./CoinWalletBadge";
import { LocationSelector } from "./LocationSelector";
import { NavigationTabs } from "./NavigationTabs";

export function HeaderBar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/venues" className="text-lg font-bold text-emerald">
            FieldIn
          </Link>
          <LocationSelector />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <CoinWalletBadge />
              <AthleteProfileChip />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl border border-emerald px-3 py-1.5 text-xs text-emerald"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
      <NavigationTabs />
    </header>
  );
}
