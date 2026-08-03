import { NODE_ENV, FRONTEND_URL, COOKIE_DOMAIN } from "./env.js";

export const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
};

export const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    domain: COOKIE_DOMAIN || undefined,
};
