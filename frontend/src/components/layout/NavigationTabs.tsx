"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Venues", href: "/venues" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Matchmaking", href: "/matchmaking" },
  { label: "Rewards", href: "/rewards" },
];

export function NavigationTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border px-4">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              active
                ? "border-emerald text-emerald"
                : "border-transparent text-text-primary/60 hover:text-text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
