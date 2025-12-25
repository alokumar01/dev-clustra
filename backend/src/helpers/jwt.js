import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN_EXPIRES, JWT_SECRET } from "../config/env.js"

export const generateAccessToken = ( userId ) => {
    const payload = {
        sub: userId,
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES
    });
}
