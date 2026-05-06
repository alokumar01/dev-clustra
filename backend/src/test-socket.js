console.log("socket started");

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTU4MDU0ZjA4YjQ5OWJjMWI4NGUxYWUiLCJpYXQiOjE3NzUyNDA4MTIsImV4cCI6MTc3NTI0MTcxMn0.Dnljd8LuJPs_Guzv3i0SFPi8ajKdiLSNvEJ_ihLLanM"
  },
  reconnection: false
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_conversation", "698392c7bb978df8aa6ff979");
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("new_message", (data) => {
  console.log("New message received:", data);
});
