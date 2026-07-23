import { NODE_ENV, FRONTEND_URL, COOKIE_DOMAIN } from "./env.js";

console.log("cors page:", FRONTEND_URL);
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
