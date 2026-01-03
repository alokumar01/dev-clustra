import jwt from "jsonwebtoken"
import User from "../modules/user/user.model.js"
import ApiError from "../helpers/apiError.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Get the token
        const token = req.cookies.accessToken;
        
        if(!token)  {
            throw new ApiError(401, "You are not logged in. Please login to get access.", "UNAUTHORIZED");
        }
        // 2. Verify the token and extract the payload, throw an error if the token is tampered with or expired
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Find the user in DB, // We used 'sub' in generateToken, so we access it here
        const user = await User.findById(decoded.sub).select("-passwordHash -emailVerifyHash -emailVerifyExpires -__v -refreshToken ");
        
        if (!user) {
            throw new ApiError(401, "The user belonging to this token no longer exists.", "USER_NOT_FOUND");
        }

        // 4. Check if account is still active (The moderation check!)
        if (user.accountStatus !== "active") {
            throw new ApiError(403, "Your account is no longer active, contact support", "ACCOUNT_INACTIVE");
        }

        // 5. GRANT ACCESS Attach user to the request so controllers can use it
        req.user = user;
        next();
        
    } catch (error) {
        // If JWT is expired or invalid, send a 401 instead of a 500
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Token expired. Please login again.", "TOKEN_EXPIRED"));
        }
        next(error);
    }
}

export const refreshTokenController = async (req, res, next) => {
    try {
        const rftoken = req.cookies.refreshToken;
        if(!rftoken) throw new ApiError(401, "You are not logged in. Please login to refresh token.", "UNAUTHORIZED")
        const decodedToken = jwt.verify(rftoken, JWT_REFRESH_SECRET)
        if(!decodedToken) throw new ApiError(402,"You are not logged in. Please login to refresh token.", "UNAUTHORIZED" )
        
        
    } catch (error) {
        
    }
    next(null);
}