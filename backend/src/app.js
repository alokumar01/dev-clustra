import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { corsOptions } from "./config/cors.js";
import v1Routes from "./routes/v1.routes.js";
import errorMiddleware from "./middleswares/error.middleware.js"

const app = express();

// Core Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", v1Routes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Global Error Middleware (LAST)
app.use(errorMiddleware);

export default app;
