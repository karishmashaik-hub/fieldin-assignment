"use client";

import { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { ChatIcon, SendIcon, StarIcon, UserIcon } from "@/components/shared/icons";
import type { SoloAvailability } from "@/types";

interface ChatMessage {
  id: number;
  from: "me" | "them";
  text: string;
}

interface AthleteResumeDrawerProps {
  athlete: SoloAvailability | null;
  onClose: () => void;
}

export function AthleteResumeDrawer({ athlete, onClose }: AthleteResumeDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  if (!athlete) return null;

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !athlete) return;

    const outgoing: ChatMessage = { id: Date.now(), from: "me", text: draft.trim() };
    setMessages((current) => [...current, outgoing]);
    setDraft("");

    // Mock reply — this module has no real messaging backend; it simulates the
    // "Invite to Squad" chat flow the brief asks for as a UI-only interaction.
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, from: "them", text: `Sounds good — see you at the ${athlete.sportType.toLowerCase()} slot!` },
      ]);
    }, 900);
  }

  return (
    <Drawer open={Boolean(athlete)} onClose={onClose} title={athlete.userName}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-border p-3">
            <p className="flex items-center justify-center gap-1 text-lg font-semibold text-emerald">
              <StarIcon className="h-3.5 w-3.5" />
              {athlete.trustScore.toFixed(1)}
            </p>
            <p className="text-[10px] text-text-primary/60">Trust Score</p>
          </div>
          <div className="rounded-2xl border border-border p-3">
            <p className="text-lg font-semibold text-emerald">{athlete.punctualityRate.toFixed(0)}%</p>
            <p className="text-[10px] text-text-primary/60">On-time</p>
          </div>
          <div className="rounded-2xl border border-border p-3">
            <p className="text-lg font-semibold text-amber">{athlete.sportType}</p>
            <p className="text-[10px] text-text-primary/60">Sport</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-text-primary/80">
          <p>
            Available {new Date(athlete.availableDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}{" "}
            at {athlete.availableTime}
          </p>
          {athlete.maxBudget !== null && <p className="mt-1">Max budget: ₹{athlete.maxBudget}/session</p>}
          {athlete.notes && <p className="mt-2 text-text-primary/60">"{athlete.notes}"</p>}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-primary/60">
            <ChatIcon className="h-3.5 w-3.5" /> Chat with {athlete.userName.split(" ")[0]}
          </p>
          <div className="flex h-48 flex-col gap-2 overflow-y-auto rounded-2xl border border-border bg-background p-3">
            {messages.length === 0 && (
              <p className="m-auto text-xs text-text-primary/40">Say hello to invite them to your squad.</p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "them" && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/20 text-emerald">
                    <UserIcon className="h-3 w-3" />
                  </span>
                )}
                <span
                  className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs ${
                    msg.from === "me" ? "bg-emerald text-background" : "border border-border text-text-primary"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="mt-2 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Invite them to your squad..."
              className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-2xl bg-emerald px-3 py-2 text-background"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </Drawer>
  );
}
