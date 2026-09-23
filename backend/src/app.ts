import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth.routes";
import { usersRouter } from "./routes/users.routes";
import { venuesRouter } from "./routes/venues.routes";
import { bookingsRouter } from "./routes/bookings.routes";
import { tournamentsRouter } from "./routes/tournaments.routes";
import { matchmakingRouter } from "./routes/matchmaking.routes";
import { rewardsRouter } from "./routes/rewards.routes";

export const app = express();

app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/matchmaking", matchmakingRouter);
app.use("/api/rewards", rewardsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);
