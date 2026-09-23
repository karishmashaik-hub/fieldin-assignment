"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { ApiClientError } from "@/lib/apiClient";
import { usePostMatchmaking } from "@/hooks/useMatchmaking";
import { useAuthStore } from "@/store/useAuthStore";
import { SPORTS } from "@/types";

interface PostAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PostAvailabilityModal({ open, onClose }: PostAvailabilityModalProps) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const postMatchmaking = usePostMatchmaking();

  const [sportType, setSportType] = useState<string>(SPORTS[0]);
  const [availableDate, setAvailableDate] = useState(todayIso());
  const [availableTime, setAvailableTime] = useState("18:00");
  const [maxBudget, setMaxBudget] = useState("150");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      showToast("Please log in to post your availability", "error");
      return;
    }

    try {
      await postMatchmaking.mutateAsync({
        kind: "solo",
        sportType,
        availableDate,
        availableTime,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
        notes: notes || undefined,
      });
      showToast("Your availability is live in the Solo Players Hub!", "success");
      setNotes("");
      onClose();
    } catch (err) {
      showToast(err instanceof ApiClientError ? err.message : "Could not post your availability.", "error");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Post Your Availability">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Sport</label>
          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          >
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-text-primary/60">Date</label>
            <input
              type="date"
              min={todayIso()}
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-primary/60">Time</label>
            <input
              type="time"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Max budget (₹)</label>
          <input
            type="number"
            min={0}
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Notes (optional)</label>
          <input
            maxLength={280}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Striker, weekday evenings"
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
        <button
          type="submit"
          disabled={postMatchmaking.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
        >
          {postMatchmaking.isPending && <Spinner />}
          Post Now
        </button>
      </form>
    </Modal>
  );
}
