import { NODE_ENV } from "./env.js";

export const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

export const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    domain: NODE_ENV === "production" ? ".aalokkumar.dev" : undefined,
};