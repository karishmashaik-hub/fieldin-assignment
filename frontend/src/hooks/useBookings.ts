import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { Booking } from "@/types";

interface CreateBookingInput {
  venueId: string;
  slotDate: string;
  slotStart: string;
  slotEnd: string;
  playerCount: number;
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (input: CreateBookingInput) =>
      apiFetch<{ booking: Booking }>("/bookings", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}
