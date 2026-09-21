import type { Request, Response } from "express";
import { pool } from "../config/db";
import { ApiError } from "../middleware/errorHandler";

export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const result = await pool.query(
    `SELECT id, name, email, avatar_url, coins_balance, trust_score, punctuality_rate, sport_preferences, created_at
     FROM users WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar_url,
    coinsBalance: user.coins_balance,
    trustScore: Number(user.trust_score),
    punctualityRate: Number(user.punctuality_rate),
    sportPreferences: user.sport_preferences,
    createdAt: user.created_at,
  });
}
