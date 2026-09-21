import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { env } from "../config/env";
import { ApiError } from "../middleware/errorHandler";
import { loginSchema, registerSchema } from "../utils/validators";

function signToken(user: { id: string; email: string }): string {
  return jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

function toPublicUser(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    coinsBalance: row.coins_balance,
    trustScore: Number(row.trust_score),
    punctualityRate: Number(row.punctuality_rate),
    sportPreferences: row.sport_preferences,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid registration details");
  }
  const { name, email, password } = parsed.data;

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, avatar_url, coins_balance, trust_score, punctuality_rate, sport_preferences`,
    [name, email, passwordHash]
  );

  const user = result.rows[0];
  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid login details");
  }
  const { email, password } = parsed.data;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
}
