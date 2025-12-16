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
      w: "majority",
    });

    console.log("MongoDB connected successfully");
    console.log(mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to application termination");
  process.exit(0);
});
