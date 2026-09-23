"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/ToastProvider";
import { ApiClientError } from "@/lib/apiClient";
import { useRegisterTournament } from "@/hooks/useTournaments";
import { useAuthStore } from "@/store/useAuthStore";
import type { Tournament } from "@/types";

interface RegisterTeamModalProps {
  tournament: Tournament;
  open: boolean;
  onClose: () => void;
}

export function RegisterTeamModal({ tournament, open, onClose }: RegisterTeamModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const registerTournament = useRegisterTournament();
  const [teamName, setTeamName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      showToast("Please log in to register a team", "error");
      router.push("/login");
      return;
    }

    try {
      await registerTournament.mutateAsync({ tournamentId: tournament.id, teamName });
      showToast(`${teamName} is registered for ${tournament.title}!`, "success");
      setTeamName("");
      onClose();
    } catch (err) {
      showToast(err instanceof ApiClientError ? err.message : "Could not register your team.", "error");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Register for ${tournament.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-text-primary/60">Team name</label>
          <input
            required
            minLength={2}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Koramangala Strikers"
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
          />
        </div>
        <div className="flex justify-between text-xs text-text-primary/60">
          <span>Entry fee</span>
          <span className="text-amber">₹{tournament.entryFee}</span>
        </div>
        <button
          type="submit"
          disabled={registerTournament.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
        >
          {registerTournament.isPending && <Spinner />}
          Confirm Registration
        </button>
      </form>
    </Modal>
  );
}
