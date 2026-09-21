import { Router } from "express";
import { getProfile } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const usersRouter = Router();

usersRouter.get("/profile", requireAuth, asyncHandler(getProfile));
