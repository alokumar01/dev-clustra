import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { PORT } from "./src/config/env.js";
import { createServer } from "http";
import { initSocket } from "./src/socket.server.js";
import { initSessionSocket } from "./src/modules/ehpemeralChat/session/session.socket.js";
import mongoose from "mongoose";
import { getIO } from "./src/socket.server.js";

const server = createServer(app);

const startServer = async () => {
  await connectDB();

  initSocket(server);
  initSessionSocket();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    try {
      getIO().close();
    } catch (error) {
      console.error("Socket shutdown failed", error);
    }
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
    process.exit(0);
  });
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Server startup failed", error);
  process.exit(1);
});

// app → Express handles HTTP routes

// server → Node HTTP server wraps Express

// io → Socket.IO attaches to the HTTP server

// server.listen() → starts both Express + Socket.IO
