export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  coinsBalance: number;
  trustScore: number;
  punctualityRate: number;
  sportPreferences: string[];
}

export interface Venue {
  id: string;
  name: string;
  sportType: string;
  address: string;
  lat: number;
  lng: number;
  hourlyRate: number;
  capacity: number;
  crowdOccupancy: number;
  weatherCondition: string;
  hasLiveCam: boolean;
  ownerId: string | null;
  distanceKm: number | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  slotDate: string;
  slotStart: string;
  slotEnd: string;
  totalAmount: number;
  perHeadAmount: number;
  playerCount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis"] as const;
export type Sport = (typeof SPORTS)[number];
