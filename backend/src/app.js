import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { corsOptions } from "./config/cors.js";
import v1Routes from "./routes/v1.routes.js";
import errorMiddleware from "./middleswares/error.middleware.js"

const app = express();

app.set("trust proxy", 1);
// Core Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use("/api/v1", v1Routes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global Error Middleware (LAST)
app.use(errorMiddleware);

export default app;
