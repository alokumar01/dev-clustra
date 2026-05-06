import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { PORT } from "./src/config/env.js";
import { createServer } from "http";
import { initSocket } from "./src/socket.server.js";

connectDB();

// // Create HTTP server
const server = createServer(app);

// initialze the socket
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app → Express handles HTTP routes

// server → Node HTTP server wraps Express

// io → Socket.IO attaches to the HTTP server

// server.listen() → starts both Express + Socket.IO