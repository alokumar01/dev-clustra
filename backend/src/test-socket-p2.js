console.log("socket started");

import { io } from "socket.io-client";

const socket = io("http://localhost:5000/session", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTdiNmZjNzFhOTVlMTk3ZWUzZDAzMDAiLCJzZXNzaW9uSWQiOiI2YTdiNjkzNGNjMzU5N2QyOTZhMTVlZGIiLCJyb2xlIjoiUEFSVElDSVBBTlQiLCJpYXQiOjE3ODY0NzQ0MzksImV4cCI6MTc4NjU2MDgzOX0.LcottadbV39mty6W4j6wtlRJOUoyrbUZKIHjM0KpwLg"
    },
    reconnection: false
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});
