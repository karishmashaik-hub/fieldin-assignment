import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { BallIcon, CloudIcon, LocationPinIcon, RainIcon, SunIcon } from "@/components/shared/icons";
import type { Venue } from "@/types";

const WEATHER_ICON: Record<string, typeof SunIcon> = {
  Clear: SunIcon,
  Cloudy: CloudIcon,
  Rainy: RainIcon,
};

interface VenueCardProps {
  venue: Venue;
  onBookSlot: (venue: Venue) => void;
}

export function VenueCard({ venue, onBookSlot }: VenueCardProps) {
  const WeatherIcon = WEATHER_ICON[venue.weatherCondition] ?? SunIcon;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border text-emerald">
            <BallIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{venue.name}</h3>
            <p className="text-xs text-text-primary/60">{venue.sportType}</p>
          </div>
        </div>
        {venue.hasLiveCam && (
          <Badge variant="emerald" className="items-center">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
            LIVE CAM
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {venue.distanceKm !== null && (
          <Badge>
            <LocationPinIcon className="h-3 w-3" />
            {venue.distanceKm < 5 ? "<5 km" : `${venue.distanceKm.toFixed(1)} km`}
          </Badge>
        )}
        <Badge>
          <WeatherIcon className="h-3 w-3" />
          {venue.weatherCondition}
        </Badge>
      </div>

      <ProgressBar value={venue.crowdOccupancy} max={100} label="Crowd occupancy" />

      <div className="flex items-center justify-between pt-1">
        <p className="text-sm font-semibold text-text-primary">
          ₹{venue.hourlyRate}
          <span className="text-xs font-normal text-text-primary/60">/hr</span>
        </p>
        <button
          onClick={() => onBookSlot(venue)}
          className="rounded-2xl bg-emerald px-4 py-2 text-xs font-medium text-background transition-transform active:scale-95"
        >
          Book Slot
        </button>
      </div>
    </div>
  );
}
