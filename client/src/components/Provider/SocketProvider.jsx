'use client'

import { useAuthStore } from "@/store/authStore";
import { socket } from "@/store/socketStore";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";


export default function SocketProvider({ children }) {
    const user = useAuthStore((state) => state.user);

    // Online user event
    useEffect(() => {
        const handleOnlineUsers = (users) => {
            useChatStore.getState().setOnlineUsers(users);
        }

        // listen for online users event
        socket.on("online_users", handleOnlineUsers);

        return () => {
            socket.off("online_users", handleOnlineUsers);
        }
    }, []);

    useEffect(() => {
        if (!user?._id) return;
        const chatStore = useChatStore.getState();

        const handleUserOnline = ({ userId }) => {
            chatStore.addOnlineUser(userId)
        };

        const handleUserOffline = ({ userId}) => {
            chatStore.removeOnlineUser(userId);
        }

        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);

        return () => {
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
        };
    }, [user?._id]);


    useEffect(() => {
        if (!user?._id) {
            socket.disconnect();
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;

        const handleNewMessage = (msg) => {
            // Ignore messages from self (already handled by optimistic UI)
            if (msg.senderId === user._id) return;

            // Get fresh state to determine if this chat is active
            const state = useChatStore.getState();
            const activeId = state.selectedChat?._id;
            const isActive = msg.conversationId === activeId;

            // Handle incoming message with guaranteed current state
            state.handleIncomingMessage(msg, isActive);

            // If viewing this chat, also append message to chat screen
            if (isActive) {
                state.appendMessageToConversation(msg.conversationId, msg);
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [user?._id]);

    return children;
}
