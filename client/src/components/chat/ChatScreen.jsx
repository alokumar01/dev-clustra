'use client'

import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  fetchSingleChatConversation,
  markAsRead,
  sendMessage,
} from "@/app/services/conversation.service"
import { useAuthStore } from "@/store/authStore"
import { useChatStore } from "@/store/chatStore"
import { socket } from "@/store/socketStore"
import { logger } from "@/lib/logger"


export default function ChatScreen({ selectedChat, onBack }) {
  const user = useAuthStore((state) => state.user);
  const emptyMessages = useRef([]);
  const conversationId = selectedChat?._id;
  const activeConversationIdRef = useRef(conversationId);
  activeConversationIdRef.current = conversationId;
  const messages = useChatStore((state) =>
    conversationId
      ? state.messagesByConversation[conversationId] || emptyMessages.current
      : emptyMessages.current
  );
  const setMessagesForConversation = useChatStore(
    (state) => state.setMessagesForConversation
  );
  const appendMessageToConversation = useChatStore(
    (state) => state.appendMessageToConversation
  );
  const updateMessageInConversation = useChatStore(
    (state) => state.updateMessageInConversation
  );
  const markConversationRead = useChatStore(
    (state) => state.markConversationRead
  );
  const updateConversationMeta = useChatStore(
    (state) => state.updateConversationMeta
  );

  const prependMessagesToConversation = useChatStore(
    (state) => state.prependMessagesToConversation
  );

  // store information for last message and hasMore nextCursor
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState("");
  const [olderMessagesError, setOlderMessagesError] = useState("");
  const nextCursorRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);


  const [content, setContent] = useState("");
  const isOnline = useChatStore((state) => state.isUserOnline(selectedChat?.chatWith?._id));

  // this useEffect for SOCKET IO LISTENING FOR JOIN ROOMS
  useEffect(() => {
    if (!selectedChat._id) return;

    // join room
    socket.emit("join_conversation", selectedChat._id);

    // clean up
    return () => {
      socket.emit("leave_conversation", selectedChat._id)
    };
  }, [selectedChat._id]);

  // fetch all message content
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    setIsLoadingMessages(true);
    setMessagesError("");
    setLoadingMore(false);
    nextCursorRef.current = null;
    setHasMore(false);
    try {
      const res = await fetchSingleChatConversation(conversationId);
      setMessagesForConversation(
        conversationId,
        [...(res.data?.messages || [])].reverse()
      );
      if (activeConversationIdRef.current === conversationId) {
        nextCursorRef.current = res.data.nextCursor;
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      logger.warn("chat.messages.load_failed", {
        area: "chat",
        operation: "fetch_messages",
        code: err.code,
      });
      if (activeConversationIdRef.current === conversationId) {
        setMessagesError("Could not load messages. Check your connection and try again.");
      }
    } finally {
      if (activeConversationIdRef.current === conversationId) {
        setIsLoadingMessages(false);
      }
    }
  }, [conversationId, setMessagesForConversation]);

  useEffect(() => {
    if (!conversationId) return;
    // reset pagination state for new conversation
    loadMessages();

    const markRead = async () => {
      try {
        markConversationRead(conversationId);
        updateConversationMeta(conversationId, { unreadCount: 0 });
        await markAsRead(conversationId);
      } catch (err) {
        logger.warn("chat.messages.mark_read_failed", {
          area: "chat",
          operation: "mark_read",
          code: err.code,
        });
      }
    };

    markRead();
  }, [conversationId, loadMessages, markConversationRead, updateConversationMeta]);


  // load older messages when user reaches top
  const loadOlderMessages = useCallback(async () => {
    if (!selectedChat?._id) return;
    if (isLoadingMore) return;
    if (!hasMore) return;

    setLoadingMore(true);
    setOlderMessagesError("");

    // call api with nextCursor
    try {
      const res = await fetchSingleChatConversation(selectedChat?._id, {
          before: nextCursorRef.current,
        }
      );

      // backend returns newest -> oldest
      // convert into oldest -> newest before prepend
      prependMessagesToConversation(
        selectedChat._id,
        [...(res.data?.messages || [])].reverse()
      );
      if (activeConversationIdRef.current === selectedChat._id) {
        nextCursorRef.current = res.data.nextCursor;
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      logger.warn("chat.messages.older_load_failed", {
        area: "chat",
        operation: "fetch_older_messages",
        code: err.code,
      });
      if (activeConversationIdRef.current === selectedChat._id) {
        setOlderMessagesError("Could not load older messages.");
      }
    } finally {
      if (activeConversationIdRef.current === selectedChat._id) {
        setLoadingMore(false);
      }
    }
  }, [
    selectedChat?._id,
    hasMore,
    isLoadingMore,
    prependMessagesToConversation,
  ]);

  const sendPendingMessage = useCallback(async (message, receiverId) => {
    updateMessageInConversation(message.conversationId, message._id, {
      sendStatus: "sending",
    });

    try {
      await sendMessage({
        receiverId,
        content: message.content,
        type: "text",
      });
      updateMessageInConversation(message.conversationId, message._id, {
        sendStatus: "sent",
      });
    } catch (err) {
      updateMessageInConversation(message.conversationId, message._id, {
        sendStatus: "failed",
      });
      logger.warn("chat.messages.send_failed", {
        area: "chat",
        operation: "send_message",
        code: err.code,
      });
    }
  }, [updateMessageInConversation]);

  // Add the message immediately, then reflect the API result on that message.
  function OnClick(messageContent) {
    if (!messageContent?.trim() || !selectedChat?._id || !user?._id) return;

    const newMessage = {
      _id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      content: messageContent,
      senderId: user._id,
      createdAt: new Date().toISOString(),
      messageType: "text",
      conversationId: selectedChat._id,
      sendStatus: "sending",
    };

    appendMessageToConversation(selectedChat._id, newMessage);
    updateConversationMeta(selectedChat._id, {
      lastMessage: newMessage,
      lastMessageAt: newMessage.createdAt,
    });
    setContent("");
    void sendPendingMessage(newMessage, selectedChat.chatWith?._id);
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-background">
      <ChatHeader selectedChat={selectedChat} isOnline={isOnline} onBack={onBack} />
      <ChatMessages
        key={conversationId}
        messages={messages}
        selectedChat={selectedChat}
        onLoadOlder={loadOlderMessages}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        isLoading={isLoadingMessages}
        error={messagesError}
        onRetry={loadMessages}
        olderMessagesError={olderMessagesError}
        onRetryOlder={loadOlderMessages}
        onRetryMessage={(message) =>
          sendPendingMessage(message, selectedChat.chatWith?._id)
        }
      />
      <ChatInput content={content} setContent={setContent} onSend={OnClick} conversationId={conversationId} />
    </div>
  )
}
