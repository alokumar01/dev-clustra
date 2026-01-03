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
