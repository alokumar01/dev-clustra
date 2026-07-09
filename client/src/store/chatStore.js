import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  conversations: [],
  selectedChat: null,
  messagesByConversation: {},

  // NEW: online users
  onlineUsers: new Set(),

  // console.log("messageByconversation from useChatStore:", messagesByConversation)
  setOnlineUsers: (users) =>
    set({
      onlineUsers: new Set(users)
    }),

  addOnlineUser: (userId) =>
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.add(userId);
      return { onlineUsers: updated };
    }),

  removeOnlineUser: (userId) =>
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.delete(userId);
      return { onlineUsers: updated };
    }),

  isUserOnline: (userId) => {
    return get().onlineUsers.has(userId);
  },

  setConversations: (conversations) => set({ conversations }),
  setSelectedChat: (selectedChat) => set({ selectedChat }),

  // Messages management all message aaya ChatScreen se
  setMessagesForConversation: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  appendMessageToConversation: (conversationId, message) =>
    set((state) => {
      const messages = state.messagesByConversation[conversationId] || [];
      const exists = messages.some((m) => m._id === message._id);
      if (exists) return {};
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...messages, message],
        },
      };
  }),

  // older message ho prepend karo with correct
  prependMessagesToConversation: (conversationId, olderMessages) => {
    set((state) => {
      const existingMessages = state.messagesByConversation[conversationId] || [];
      const newMessages = olderMessages.filter(
        (msg) => !existingMessages.some((existingMsg) => existingMsg._id === msg._id)
      );
      if (newMessages.length === 0) return {};
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...newMessages, ...existingMessages],
        },
      };
    })

  },

  markConversationRead: (conversationId) =>
    set((state) => ({
      // console.log("marking conversation read for:", conversationId),
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      ),

    })),

  updateMessageAsRead: (conversationId, readerId, readTime) =>
    set((state) => {
      const messages = state.messagesByConversation[conversationId] || [];
      const updatedMessages = messages.map((msg) => {
        if (msg.senderId !== readerId && !msg.readAt) {
          return { ...msg, readAt: readTime };
        }
        return msg;
      })

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: updatedMessages,
        },
      };
    }),

  updateConversationMeta: (conversationId, patch) =>
    set((state) => {
      const conversations = state.conversations
        .map((conversation) =>
          conversation._id === conversationId
            ? { ...conversation, ...patch }
            : conversation
        )
        .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      return { conversations };
    }),

  // Handle incoming socket message with correct unreadCount logic
  handleIncomingMessage: (msg, isActive) =>
    set((state) => {
      // Find conversation inside state update (guaranteed current data)
      const conversationIndex = state.conversations.findIndex(
        (c) => c._id === msg.conversationId
      );

      if (conversationIndex === -1) return {}; // Conversation not found

      // Calculate unreadCount based on CURRENT state, not stale snapshot
      const currentUnreadCount = state.conversations[conversationIndex].unreadCount || 0;
      const newUnreadCount = isActive ? 0 : currentUnreadCount + 1;

      // Update conversation with new message, timestamp, and unreadCount
      const updatedConversations = [...state.conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        lastMessage: msg,
        lastMessageAt: msg.createdAt,
        unreadCount: newUnreadCount,
      };

      // Sort by most recent message
      updatedConversations.sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );

      return { conversations: updatedConversations };
    }),
}));
