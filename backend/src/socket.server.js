//server engine (as io) 
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config/env.js";
import ApiError from "./helpers/apiError.js";
import cookie from "cookie"

// ws://localhost:5000/socket.io/?EIO=4&transport=websocket

// userId = set(socketId);
const onlineUser = new Map(); // userId => Set(socketIds)


let io;
//STEP 1. SOCKET KO INITILIZE KIYA
export const initSocket = (server) => {
    console.log("Socket server initialized");
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        },
    });

    // AUTH MIDDLEWARE
    io.use((socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie
             // we can use cookie later 
            if (!cookies) {
                throw ApiError(401, "Cookies not found", "COOKIES_REQUIRED")
            }

            const parsed =  cookie.parse(cookies)
            const token = parsed.accessToken ;

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
        const userId = socket.user.id;

        console.log("User connected:", userId);

        //  Add socket
        if (!onlineUser.has(userId)) {
            onlineUser.set(userId, new Set());
            io.emit("user_online", { userId }); // first time online
        }

        onlineUser.get(userId).add(socket.id);

        console.log("Current sockets for user:", onlineUser.get(userId));

        // join personal room
        socket.join(`user:${userId}`);

        // join conversation
        socket.on("join_conversation", (conversationId) => {
            socket.join(`chat:${conversationId}`);
            socket.activeConversation = conversationId;

            console.log(`User ${userId} joined chat ${conversationId}`);
        });

        // leave conversation
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`chat:${conversationId}`);

            if (socket.activeConversation === conversationId) {
                socket.activeConversation = null;
            }
        });

        // disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);

            const userSockets = onlineUser.get(userId);

            if (userSockets) {
                userSockets.delete(socket.id);

                console.log("Remaining sockets:", userSockets);

                if (userSockets.size === 0) {
                    onlineUser.delete(userId);

                    console.log("User is fully offline:", userId);

                    io.emit("user_offline", { userId });
                }
            }
        });
    });
}

// online user outside
export const getUserSocket = (userId) => {
    return onlineUser.get(userId);
}


//export io we can use in controller
export const getIO = () => {
    if (!io) {
        throw ApiError(401, "Socket.io not initialized");
    }

    return io;
};