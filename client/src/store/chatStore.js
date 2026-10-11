import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  conversations: [],
  selectedChat: null,
  messagesByConversation: {},
  // search result in conversation
  searchResults: [],

  setSearchResults: (users) =>
    set({
      searchResults: users
    }),

  // NEW: online users
  onlineUsers: new Set(),

  setOnlineUsers: (users) =>
    set({
      onlineUsers: new Set(users.map((userId) => userId?.toString()).filter(Boolean))
    }),

  clearPresence: () => set({ onlineUsers: new Set(), typingUsers: new Map() }),

  addOnlineUser: (userId) =>
    set((state) => {
      const updated = new Set(state.onlineUsers);
      if (userId) updated.add(userId.toString());
      return { onlineUsers: updated };
    }),

  removeOnlineUser: (userId) =>
    set((state) => {
      const updated = new Set(state.onlineUsers);
      if (userId) updated.delete(userId.toString());
      return { onlineUsers: updated };
    }),

  isUserOnline: (userId) => {
    return get().onlineUsers.has(userId?.toString());
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

  updateMessageInConversation: (conversationId, messageId, patch) =>
    set((state) => {
      const messages = state.messagesByConversation[conversationId] || [];
      const updatedMessages = messages.map((message) =>
        message._id === messageId ? { ...message, ...patch } : message
      );
      if (updatedMessages.every((message, index) => message === messages[index])) {
        return {};
      }
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: updatedMessages,
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

  // Append invite conversation to top
  appendInviteConversation: (data) => {
    set((state) => {
      const existingConversations = state.conversations;

      const hasInviteConversation = existingConversations.find(u => u._id === data._id);
      if (hasInviteConversation) {
        return state;
      }

      return {
        conversations: [data, ...existingConversations],
      };

    });
  },

  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      ),

    })),

  updateMessageAsRead: (conversationId, readerId, readTime) =>
    set((state) => {
      const messages = state.messagesByConversation[conversationId] || [];
      const updatedMessages = messages.map((msg) => {
        if (msg.senderId?.toString() !== readerId?.toString() && !msg.readAt) {
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
        (c) => c._id?.toString() === msg.conversationId?.toString()
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

  typingUsers: new Map(),

  setTypingUser: (conversationId, userId) => {
    if (!conversationId || !userId) return;

    set((state) => {
      const typingUsers = new Map(state.typingUsers);
      typingUsers.set(conversationId.toString(), userId.toString());

      return { typingUsers };
    });
  },

  clearTypingUser: (conversationId) => {
    if (!conversationId) return;

    set((state) => {
      const typingUsers = new Map(state.typingUsers);
      typingUsers.delete(conversationId.toString());
      
      return { typingUsers };
    });
  },

  clearTypingForUser: (userId) => {
    if (!userId) return;

    set((state) => {
      const typingUsers = new Map(state.typingUsers);
      const normalizedUserId = userId.toString();
      for (const [conversationId, typingUserId] of typingUsers) {
        if (typingUserId?.toString() === normalizedUserId) {
          typingUsers.delete(conversationId);
        }
      }
      return { typingUsers };
    });
  },






}));


/*
Realtime update of conversation should be visible whenever the user responds.
Write in zustand.
*/
