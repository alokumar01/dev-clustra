import dotenv from 'dotenv';
dotenv.config();

// Extract Cloudinary configuration from the URL
function extractCloudinaryConfig() {
    const cloudinaryUrl = process.env.CLOUDINARY_URL || "cloudinary://643326862345851:TQ0X5mRe9ut8rgNTByM2jmhhIYA@ddk9qhmit";
    const regex = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;
    const match = cloudinaryUrl.match(regex);
    if (!match) {
        throw new Error('Invalid Cloudinary URL format');
    }
    const [, apiKey, apiSecret, cloudName] = match;
    return {
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    };
}


export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const MONGODB_POOLSIZE = parseInt(process.env.MONGODB_POOLSIZE) || 10;
export const MONGODB_CONNECT_TIMEOUT = parseInt(process.env.MONGODB_CONNECT_TIMEOUT) || 5000;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
export const JWT_ACCESS_TOKEN_EXPIRES  = process.env.JWT_ACCESS_TOKEN_EXPIRES
export const NODE_ENV = process.env.NODE_ENV
export const JWT_REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const CLOUDINARY_CONFIG =  extractCloudinaryConfig()
