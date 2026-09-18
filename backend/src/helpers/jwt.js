import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_TOKEN_EXPIRES, JWT_SECRET } from "../config/env.js"

export const generateAccessToken = ( userId ) => {
    const payload = {
        sub: userId,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES
    });
}

export const generateRefreshToken = ( userId ) => {
    const payload = {
        sub: userId,
    }

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES
    })
}

// TEMP CHAT SESSION TOKEN
export const generateSessionToken = (participantId, sessionId, role, sessionExpiresAt) => {
    const payload = {
        sub: participantId, sessionId, role
    }

    const expiresAt = new Date(sessionExpiresAt).getTime();

    if (Number.isNaN(expiresAt)) {
        throw new Error("Invalid session expiry");
    }

    const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);

    if (expiresIn <= 0) {
        throw new Error("Session has already expired");
    }

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn
    });
}
