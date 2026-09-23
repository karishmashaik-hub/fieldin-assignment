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

export interface Tournament {
  id: string;
  title: string;
  sportType: string;
  venueId: string | null;
  venueName: string | null;
  startDate: string;
  entryFee: number;
  maxTeams: number;
  registeredTeams: number;
  prizePool: number;
  status: string;
  createdAt: string;
}

export interface SquadRequest {
  id: string;
  captainId: string;
  captainName: string;
  captainTrustScore: number;
  venueId: string | null;
  venueName: string | null;
  sportType: string;
  slotDate: string;
  slotStart: string;
  totalCost: number;
  perHeadCost: number;
  slotsTotal: number;
  slotsFilled: number;
  status: string;
  createdAt: string;
}

export interface SoloAvailability {
  id: string;
  userId: string;
  userName: string;
  trustScore: number;
  punctualityRate: number;
  sportType: string;
  availableDate: string;
  availableTime: string;
  maxBudget: number | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Voucher {
  id: string;
  title: string;
  description: string | null;
  coinCost: number;
  discountValue: string | null;
  validUntil: string | null;
  isActive: boolean;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  type: "earned" | "spent";
  source: "rvm" | "booking" | "voucher" | "bonus";
  referenceId: string | null;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: CoinTransaction[];
}
