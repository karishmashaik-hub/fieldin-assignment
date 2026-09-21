import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const bookingSchema = z.object({
  venueId: z.string().uuid(),
  slotDate: z.string(), // YYYY-MM-DD
  slotStart: z.string(), // HH:MM
  slotEnd: z.string(), // HH:MM
  playerCount: z.number().int().min(1),
});
