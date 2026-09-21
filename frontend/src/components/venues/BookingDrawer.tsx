"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { ApiClientError } from "@/lib/apiClient";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAuthStore } from "@/store/useAuthStore";
import type { Venue } from "@/types";

const SLOT_HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 - 21:00

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

interface BookingDrawerProps {
  venue: Venue | null;
  onClose: () => void;
}

export function BookingDrawer({ venue, onClose }: BookingDrawerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const createBooking = useCreateBooking();

  const [slotDate, setSlotDate] = useState(todayIso());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [playerCount, setPlayerCount] = useState(4);

  const perHead = useMemo(() => {
    if (!venue) return 0;
    return Math.round((venue.hourlyRate / playerCount) * 100) / 100;
  }, [venue, playerCount]);

  if (!venue) return null;

  function reset() {
    setSelectedHour(null);
    setPlayerCount(4);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleConfirm() {
    if (!venue || selectedHour === null) return;

    if (!user) {
      showToast("Please log in to book a slot", "error");
      router.push("/login");
      return;
    }

    try {
      await createBooking.mutateAsync({
        venueId: venue.id,
        slotDate,
        slotStart: formatHour(selectedHour),
        slotEnd: formatHour(selectedHour + 1),
        playerCount,
      });
      showToast(`Booking confirmed at ${venue.name}!`, "success");
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        showToast(err.message, "error");
      } else {
        showToast("Could not complete the booking. Please try again.", "error");
      }
    }
  }

  return (
    <Drawer open={Boolean(venue)} onClose={handleClose} title={venue.name}>
      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Date</label>
          <input
            type="date"
            min={todayIso()}
            value={slotDate}
            onChange={(e) => {
              setSlotDate(e.target.value);
              setSelectedHour(null);
            }}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-text-primary/60">Time slot</label>
          <div className="grid grid-cols-4 gap-2">
            {SLOT_HOURS.map((hour) => (
              <button
                key={hour}
                onClick={() => setSelectedHour(hour)}
                className={`rounded-2xl border px-2 py-2 text-xs ${
                  selectedHour === hour
                    ? "border-emerald bg-emerald/10 text-emerald"
                    : "border-border text-text-primary/80"
                }`}
              >
                {formatHour(hour)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Players</label>
          <input
            type="number"
            min={1}
            value={playerCount}
            onChange={(e) => setPlayerCount(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex justify-between text-sm text-text-primary/70">
            <span>Total ({venue.name})</span>
            <span>₹{venue.hourlyRate}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm font-semibold text-text-primary">
            <span>Per person ({playerCount} players)</span>
            <span>₹{perHead}</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedHour === null || createBooking.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-3 text-sm font-medium text-background disabled:opacity-50"
        >
          {createBooking.isPending && <Spinner />}
          Confirm Booking
        </button>
      </div>
    </Drawer>
  );
}
