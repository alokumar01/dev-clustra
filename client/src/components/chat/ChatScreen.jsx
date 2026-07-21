'use client'

import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import { useEffect, useRef, useState, useCallback } from "react"
import { FetchSingleChatConversation, MarkAsRead, SendMessage } from "@/app/services/conversation.service"
import { useAuthStore } from "@/store/authStore"
import { useChatStore } from "@/store/chatStore"
import { socket } from "@/store/socketStore"



export default function ChatScreen({ selectedChat }) {
  console.log("chat screen selected chat testing: ", selectedChat);
  const user = useAuthStore((state) => state.user);
  // console.log("user from chat screen:", user)
  const emptyMessages = useRef([]);
  const conversationId = selectedChat?._id;
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
  // const [nextCursor, setNextCursor] = useState(null);
  const nextCursorRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);


  const [content, setContent] = useState("");
  // isonline ko chat header me jisse baat karna hai uska data bhejna hai not user id
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
  useEffect(() => {
    if (!selectedChat._id) return;
    // reset pagination state for new conversation
    setLoadingMore(false);
    nextCursorRef.current = null;
    setHasMore(false);

    const fetchMessages = async () => {
      try {
        const res = await FetchSingleChatConversation(conversationId);
        // latest cursor information
        // console.log("chat screen message:", res)
        nextCursorRef.current = res.data.nextCursor;
        setHasMore(res.data.hasMore);

        // console.log("next cursor latest:", nextCursorRef.current);

        // backend newest -> oldest
        // ui oldest -> newest
        setMessagesForConversation(
          selectedChat._id,
          [...(res.data?.messages || [])].reverse()
        );
      } catch (err) {
        console.error(err);
      }
    };

    const markRead = async () => {
      try {
        markConversationRead(selectedChat._id);
        updateConversationMeta(selectedChat._id, { unreadCount: 0 });
        await MarkAsRead(selectedChat._id);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
    markRead();
  }, [selectedChat._id, markConversationRead, setMessagesForConversation, updateConversationMeta]);


  // load older messages when user reaches top
  const loadOlderMessages = useCallback(async () => {
    if (!selectedChat?._id) return;
    if (isLoadingMore) return;
    if (!hasMore) return;

    setLoadingMore(true);

    // call api with nextCursor
    try {
      const res = await FetchSingleChatConversation( selectedChat?._id, {
          before: nextCursorRef.current,
        }
      );

      // console.log("older messages response:", res.data);
      // console.log("older message length", res.data.messages.length)

      // update pagination information
      nextCursorRef.current = res.data.nextCursor;
      setHasMore(res.data.hasMore);
      // console.log("next cursor after older messages:", nextCursorRef.current);

      // backend returns newest -> oldest
      // convert into oldest -> newest before prepend
      prependMessagesToConversation(
        selectedChat._id,
        [...(res.data?.messages || [])].reverse()
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [
    selectedChat?._id,
    hasMore,
    isLoadingMore,
    prependMessagesToConversation,
  ]);

  // SEND MESSAGE AND UPDATE UI ---> OPTIMISTIC UI
  async function OnClick() {
    if (!content.trim() || !selectedChat?._id) return;

    const newMessage = {
      _id: Date.now(),
      content: content,
      senderId: user._id,
      createdAt: new Date().toISOString(),
      messageType: "text",
      conversationId: selectedChat._id,
    };

    appendMessageToConversation(selectedChat._id, newMessage);
    updateConversationMeta(selectedChat._id, {
      lastMessage: newMessage,
      lastMessageAt: newMessage.createdAt,
    });
    setContent("");

    try {
      await SendMessage({
        receiverId: selectedChat.chatWith?._id,
        content,
        type: "text",
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedChat={selectedChat} isOnline={isOnline} />
      {/* <ScrollArea className="h-full"> */}
        <ChatMessages
          messages={messages}
          selectedChat={selectedChat}
          onLoadOlder={loadOlderMessages}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
        />
      {/* </ScrollArea> */}
      <ChatInput content={content} setContent={setContent} onSend={OnClick} />
    </div>
  )
}
