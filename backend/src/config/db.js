import mongoose from "mongoose";
import {
  MONGO_URI,
  MONGODB_POOLSIZE,
  MONGODB_CONNECT_TIMEOUT
} from "./env.js"

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: MONGODB_POOLSIZE,
      connectTimeoutMS: MONGODB_CONNECT_TIMEOUT,
      socketTimeoutMS: 45000,
      ssl: true,
      writeConcern: "majority",
    });

    console.log("MongoDB connected successfully");
    console.log("DB Connected:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
}
