'use client'

import { useAuthStore } from "@/store/authStore";
import { socket } from "@/store/socketStore";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";
import { MarkAsRead } from "@/app/services/conversation.service";
import { toast } from "sonner";

export default function SocketProvider({ children }) {
    const user = useAuthStore((state) => state.user);
    // console.log("from socket provider:", user);

    // Online user event management Multiple users online then send the list of online users to newly connected clients
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

    // User online/offline event management
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

    // Socket connection management
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

    // Handle incoming messages
    useEffect(() => {
        if (!user?._id) return;

        const handleNewMessage = async (msg) => {
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

                await MarkAsRead(msg.conversationId);
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [user?._id]);

    // Mark conversation as read when user is viewing it
    useEffect(() => {
        if (!user?._id) return;

        const handleMessageRead = (data) => {
            // useChatStore.getState().markConversationRead(data.conversationId);
            const chatStore = useChatStore.getState();

            // chatStore.markConversationRead(data.conversationId);

            chatStore.updateMessageAsRead (
                data.conversationId,
                data.readerId,
                data.readTime
            )

            // await MarkAsRead(msg.conversationId); testing here
        }

        socket.on("message_read", handleMessageRead);

        return () => {
            socket.off("message_read", handleMessageRead);
        }

    }, [user?._id]);

    // new conversation created, inform to inviter
    useEffect(() => {
        if (!user?._id) return;

        const InviteConversation = (data) => {
            const chatStore = useChatStore.getState();
            chatStore.appendInviteConversation(data)
            // console.log("data from socker provider append conve: ", data);

           toast.success(`${data.chatWith.username} accepted your invite. Say hi! 👋`);
        }

        socket.on("conversation_created", InviteConversation);

        return () => {
            socket.off("conversation_created", InviteConversation);
        }
    }, [user?._id]);

    return children;
}
