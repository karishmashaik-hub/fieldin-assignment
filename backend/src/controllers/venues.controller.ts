import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import { getVenueById, listVenues } from "../services/venue.service";

function parseNumber(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function getVenues(req: Request, res: Response): Promise<void> {
  const venues = await listVenues({
    sport: typeof req.query.sport === "string" ? req.query.sport : undefined,
    maxDistanceKm: parseNumber(req.query.maxDistance),
    minPrice: parseNumber(req.query.minPrice),
    maxPrice: parseNumber(req.query.maxPrice),
    lat: parseNumber(req.query.lat),
    lng: parseNumber(req.query.lng),
  });
  res.json({ venues });
}

export async function getVenue(req: Request, res: Response): Promise<void> {
  const venue = await getVenueById(req.params.id);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  res.json({ venue });
}
