//server engine (as io)
import cookie from "cookie";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { FRONTEND_URL, JWT_SECRET } from "./config/env.js";
import ApiError from "./helpers/apiError.js";
import Conversation from "./modules/conversation/conversation.model.js";

// userId = set(socketId);
const onlineUser = new Map(); // userId => Set(socketIds)


let io;
//STEP 1. SOCKET KO INITILIZE KIYA
export const initSocket = (server) => {
    console.log("Global Socket Server Initialized...");
    io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true
        },
    });

    // AUTH MIDDLEWARE
    io.use((socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie
             // we can use cookie later
            if (!cookies) {
                throw new ApiError(401, "Cookies not found", "COOKIES_REQUIRED")
            }

            const parsed =  cookie.parse(cookies)
            const token = parsed.accessToken ;

            if (!token) {
                throw new ApiError(401, "Token not found", "TOKEN_REQUIRED")
            }

            const decode = jwt.verify(token, JWT_SECRET);

            socket.user = {
                id: decode.sub || decode.id
            }

            next();

        } catch (error) {
            if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
                return next(new ApiError(401, "Invalid or expired token", "INVALID_TOKEN"));
            }
            next(error)
        }
    })

    // CONNECTION EVENT
    io.on("connection", (socket) => {
        const userId = socket.user.id;

        console.log("User connected:", userId, typeof userId);

        //  Add socket
        if (!onlineUser.has(userId)) {
            onlineUser.set(userId, new Set());

            io.emit("user_online", { userId }); // first time online
        }

        onlineUser.get(userId).add(socket.id);

        // send the current user list to newly connectted client
        socket.emit("online_users", [...onlineUser.keys()]);

        console.log("Current sockets for user:", onlineUser.get(userId));

        // join personal room
        socket.join(`user:${userId}`);

        // join conversation
        const authorizeConversation = async (conversationId) => {
            if (!mongoose.isValidObjectId(conversationId)) return false;
            return Boolean(await Conversation.exists({
                _id: conversationId,
                participants: userId
            }));
        };

        socket.on("join_conversation", async (conversationId, ack) => {
            if (!(await authorizeConversation(conversationId))) {
                return ack?.({ success: false, message: "Conversation access denied" });
            }
            socket.join(`chat:${conversationId}`);
            socket.activeConversation = conversationId;
            ack?.({ success: true });

            console.log(`User ${userId} joined chat ${conversationId}`);
        });


        // leave conversation
        socket.on("leave_conversation", async (conversationId, ack) => {
            if (!(await authorizeConversation(conversationId))) {
                return ack?.({ success: false, message: "Conversation access denied" });
            }
            socket.leave(`chat:${conversationId}`);

            if (socket.activeConversation === conversationId) {
                socket.activeConversation = null;
            }
            ack?.({ success: true });
        });

        // Typing indicator
        socket.on("typing:start", async (conversationId) => {
            if (!(await authorizeConversation(conversationId))) return;
            socket.to(`chat:${conversationId}`).emit("typing:start", {
                conversationId,
                userId
            });
        });

        socket.on("typing:stop", async (conversationId) => {
            if (!(await authorizeConversation(conversationId))) return;
            socket.to(`chat:${conversationId}`).emit("typing:stop", {
                conversationId,
                userId
            });
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
        throw new ApiError(500, "Global Socket.io not initialized", "GLOBAL_SOCKET_NOT_INITIALIZED");
    }

    return io;
};
