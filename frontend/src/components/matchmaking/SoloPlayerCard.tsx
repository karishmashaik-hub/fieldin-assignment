import { Badge } from "@/components/shared/Badge";
import { CalendarIcon, StarIcon, UserIcon } from "@/components/shared/icons";
import type { SoloAvailability } from "@/types";

interface SoloPlayerCardProps {
  athlete: SoloAvailability;
  onInvite: (athlete: SoloAvailability) => void;
}

export function SoloPlayerCard({ athlete, onInvite }: SoloPlayerCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border text-emerald">
            <UserIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{athlete.userName}</h3>
            <p className="text-xs text-text-primary/60">{athlete.sportType}</p>
          </div>
        </div>
        <Badge variant="amber">
          <StarIcon className="h-3 w-3" />
          {athlete.punctualityRate.toFixed(0)}% on-time
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge>
          <CalendarIcon className="h-3 w-3" />
          {new Date(athlete.availableDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
          {athlete.availableTime}
        </Badge>
        {athlete.maxBudget !== null && <Badge variant="emerald">Up to ₹{athlete.maxBudget}</Badge>}
      </div>

      {athlete.notes && <p className="text-xs text-text-primary/60">"{athlete.notes}"</p>}

      <button
        onClick={() => onInvite(athlete)}
        className="rounded-2xl bg-emerald px-4 py-2 text-xs font-medium text-background transition-transform active:scale-95"
      >
        Invite to Squad
      </button>
    </div>
  );
}
