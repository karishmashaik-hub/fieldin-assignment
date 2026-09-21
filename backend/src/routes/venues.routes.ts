import { Router } from "express";
import { getVenue, getVenues } from "../controllers/venues.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const venuesRouter = Router();

venuesRouter.get("/", asyncHandler(getVenues));
venuesRouter.get("/:id", asyncHandler(getVenue));
