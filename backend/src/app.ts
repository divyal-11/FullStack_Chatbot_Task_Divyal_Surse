import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import enquiriesRouter from "./routes/enquiries.routes";
import { errorHandler } from "./middleware/errorhandler";
import { env } from "./config/env";

const app = express();

app.use(helmet());

app.use(cors({
  origin: env.CORS_ORIGIN,
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/enquiries", enquiriesRouter);

app.use(errorHandler);

export default app;