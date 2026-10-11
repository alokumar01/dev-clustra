'use client'

import { useAuthStore } from "@/store/authStore";
import { socket, useSocketStore } from "@/store/socketStore";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";
import { markAsRead } from "@/app/services/conversation.service";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export default function SocketProvider({ children }) {
    const user = useAuthStore((state) => state.user);
    // Online user event management Multiple users online then send the list of online users to newly connected clients
    useEffect(() => {
        const handleOnlineUsers = (users) => {
            useChatStore.getState().setOnlineUsers(users);
        }

        const setConnectionStatus = useSocketStore.getState().setConnectionStatus;
        const handleConnect = () => {
            setConnectionStatus("connected");
            const conversationId = useChatStore.getState().selectedChat?._id;
            if (conversationId) {
                socket.emit("join_conversation", conversationId);
            }
        };
        const handleDisconnect = (reason) => {
            useChatStore.getState().clearPresence();
            if (typeof navigator !== "undefined" && !navigator.onLine) {
                setConnectionStatus("offline");
            } else {
                setConnectionStatus(reason === "io client disconnect" ? "offline" : "reconnecting");
            }
        };
        const handleConnectError = (error) => {
            setConnectionStatus(socket.active ? "reconnecting" : "failed");
            logger.error(
                "socket.chat.connection_failed",
                { area: "chat_socket" },
                error,
            );
        };
        const handleReconnectAttempt = () => setConnectionStatus("reconnecting");
        const handleReconnectFailed = () => setConnectionStatus("failed");
        const handleOffline = () => {
            setConnectionStatus("offline");
            useChatStore.getState().clearPresence();
        };
        const handleOnline = () => {
            if (socket.connected) {
                setConnectionStatus("connected");
            } else if (useAuthStore.getState().user?._id) {
                setConnectionStatus("reconnecting");
                socket.connect();
            }
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("online_users", handleOnlineUsers);
        socket.on("connect_error", handleConnectError);
        socket.io.on("reconnect_attempt", handleReconnectAttempt);
        socket.io.on("reconnect_failed", handleReconnectFailed);
        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("online_users", handleOnlineUsers);
            socket.off("connect_error", handleConnectError);
            socket.io.off("reconnect_attempt", handleReconnectAttempt);
            socket.io.off("reconnect_failed", handleReconnectFailed);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
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
            chatStore.clearTypingForUser(userId);
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
            useSocketStore.getState().setConnectionStatus("offline");
            socket.disconnect();
            return;
        }

        useSocketStore.getState().setConnectionStatus("connecting");
        if (!socket.connected) {
            socket.connect();
        } else {
            useSocketStore.getState().setConnectionStatus("connected");
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
            if (msg.senderId?.toString() === user._id?.toString()) return;

            // Get fresh state to determine if this chat is active
            const state = useChatStore.getState();
            const activeId = state.selectedChat?._id;
            const isActive = msg.conversationId?.toString() === activeId?.toString();

            // Handle incoming message with guaranteed current state
            state.handleIncomingMessage(msg, isActive);

            // If viewing this chat, also append message to chat screen
            if (isActive) {
                state.appendMessageToConversation(msg.conversationId, msg);

                try {
                    await markAsRead(msg.conversationId);
                } catch (error) {
                    logger.warn("socket.chat.mark_read_failed", {
                        area: "chat_socket",
                        operation: "mark_read",
                        code: error.code,
                    });
                }
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
           toast.success(`${data.chatWith.username} accepted your invite. Say hi! 👋`);
        }

        socket.on("conversation_created", InviteConversation);

        return () => {
            socket.off("conversation_created", InviteConversation);
        }
    }, [user?._id]);



    // Typing indicator management show user is typing or not 
    useEffect(() => {
        if (!user?._id) return;

        const chatStore = useChatStore.getState();

        const handleTypingStart = ({ conversationId, userId }) => {
            if (userId?.toString() === user._id?.toString()) return;

            chatStore.setTypingUser(conversationId, userId);
        }

        const handleTypingStop = ({ conversationId }) => {
            chatStore.clearTypingUser(conversationId);
        }

        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);

        return () => {
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);
        }
    }, [user?._id]);

    return children;
}
