//server engine (as io) 
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config/env.js";
import ApiError from "./helpers/apiError.js";


// ws://localhost:5000/socket.io/?EIO=4&transport=websocket

// userId = set(socketId);
const onlineUser = new Map();

let io;
//STEP 1. SOCKET KO INITILIZE KIYA
export const initSocket = (server) => {
    console.log("Socket server initialized");
    io = new Server(server, {
        cors: {
            origin: "*",
            // credentials: true
        },
    });

    // AUTH MIDDLEWARE
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token // we can use cookie later 
            if (!token) {
                throw ApiError(401, "Token not found", "TOKEN_REQUIRED")
            }

            const decode = jwt.verify(token, JWT_SECRET);   
            socket.user = {
                id: decode.sub || decode.id
            }

            next();
            
        } catch (error) {
            next(error)
        }
    })

    // CONNECTION EVENT
    io.on("connection", (socket) => {
        console.log("User connected: ", socket.user.id);
        
        const userId = socket.user.id;
        if(!onlineUser.has(userId)) {
            onlineUser.set(userId, socket)
        }
        
        // if set size is 1
        const size = onlineUser.size;
        if (size === 1) {
            io.emit("user_online", { userId });
        }

        //user room
        socket.join(`user:${socket.user.id}`);

        //join conversation room
        socket.on("join_conversation", (conversationId) => {
            socket.join(`chat:${conversationId}`);
            console.log(`user ${socket.user.id} joined chat ${conversationId}`);
        });

        //leave conversation
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`chat:${conversationId}`);
        })

        //disconnect
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.user.id);
            //on disconnect emitting user offline 
            onlineUser.delete(userId)
            
            if (onlineUser.size === 0) {
                io.emit("user_offline", { userId });
            }
        });

    })
}







//export io we can use in controller
export const getIO = () => {
    if (!io) {
        throw ApiError(401, "Socket.io not initialized");
    }

    return io;
};