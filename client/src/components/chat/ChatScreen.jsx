'use client'

import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import { useEffect, useRef, useState } from "react"
import { FetchSingleChatConversation, MarkAsRead, SendMessage } from "@/app/services/conversation.service"
import { useAuthStore } from "@/store/authStore"
import { useChatStore } from "@/store/chatStore"
import { socket } from "@/store/socketStore"




export default function ChatScreen({ selectedChat }) {
  const user = useAuthStore((state) => state.user);
  const emptyMessages = useRef([]);
  const messages = useChatStore((state) =>
    selectedChat?._id
      ? state.messagesByConversation[selectedChat._id] || emptyMessages.current
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
  const [content, setContent] = useState("");
  const isOnline = useChatStore((state) => state.isUserOnline(user?._id));

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

    const fetchMessages = async () => {
      try {
        const res = await FetchSingleChatConversation(selectedChat._id);
        setMessagesForConversation(
          selectedChat._id,
          [...(res.data?.messages || [])].reverse()
        );
      } catch (err) {
        console.log(err);
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
        <ChatMessages messages={messages} selectedChat={selectedChat} />
      {/* </ScrollArea> */}
      <ChatInput content={content} setContent={setContent} onSend={OnClick} />
    </div>
  )
}

