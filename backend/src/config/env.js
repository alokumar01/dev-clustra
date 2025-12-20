import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const MONGODB_POOLSIZE = parseInt(process.env.MONGODB_POOLSIZE) || 10;
export const MONGODB_CONNECT_TIMEOUT = parseInt(process.env.MONGODB_CONNECT_TIMEOUT) || 5000;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL