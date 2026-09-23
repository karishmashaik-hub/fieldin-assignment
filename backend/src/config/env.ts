import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: required("REDIS_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  refreshTokenExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 30),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
};
