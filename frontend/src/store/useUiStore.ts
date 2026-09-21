import { create } from "zustand";

export interface DemoLocation {
  label: string;
  lat: number;
  lng: number;
}

export const DEMO_LOCATIONS: DemoLocation[] = [
  { label: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6146 },
  { label: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408 },
  { label: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.75 },
  { label: "Electronic City, Bengaluru", lat: 12.8452, lng: 77.6602 },
];

interface UiState {
  location: DemoLocation;
  setLocation: (location: DemoLocation) => void;
  matchmakingSportFilter: string | null;
  setMatchmakingSportFilter: (sport: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  location: DEMO_LOCATIONS[0],
  setLocation: (location) => set({ location }),
  matchmakingSportFilter: null,
  setMatchmakingSportFilter: (sport) => set({ matchmakingSportFilter: sport }),
}));
