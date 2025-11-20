import {
  ChatState,
  IConversation,
  IMessage,
  OnlineUserState,
} from "@/types/chat.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
  conversations: [],
  messages: [],
  onlineUsers: [],
  selectedConversation: null,
  activeChat: null,
  unreadCounts: {},
  totalUnreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      // Ensure all createdAt/updatedAt are strings
      state.messages = action.payload.map((msg) => ({
        ...msg,
      }));
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<IConversation | null>
    ) => {
      state.selectedConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      // Ensure createdAt/updatedAt are strings
      const msg = {
        ...action.payload,
      };
      state.messages.push(msg);

      // If this is a message to the current user and not from the active chat,
      // increment the unread count
      if (msg.senderId !== state.activeChat) {
        const senderId = msg.senderId;
        state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
        // Recalculate total unread count
        state.totalUnreadCount = Object.values(state.unreadCounts).reduce(
          (sum, count) => sum + count,
          0
        );
      }
    },
    addRealTimeMessage: (state, action: PayloadAction<IMessage>) => {
      // Ensure createdAt/updatedAt are strings
      const msg = {
        ...action.payload,
      };

      // Check if there's an optimistic message (temp-*) with the same content and sender
      // This handles the case where the sender receives their own message back
      const optimisticMessageIndex = state.messages.findIndex(
        (m) =>
          m.id?.startsWith("temp-") &&
          m.content === msg.content &&
          m.senderId === msg.senderId &&
          m.conversationId === msg.conversationId
      );

      if (optimisticMessageIndex !== -1) {
        // Replace the optimistic message with the real one
        state.messages[optimisticMessageIndex] = msg;
        return;
      }

      // Check if this message already exists (prevent duplicates)
      const existingMessage = state.messages.find(
        (m) =>
          m.id === msg.id ||
          (m.content === msg.content &&
            m.senderId === msg.senderId &&
            m.conversationId === msg.conversationId &&
            Math.abs(
              new Date(m.createdAt || "").getTime() -
                new Date(msg.createdAt || "").getTime()
            ) < 5000)
      );
      if (existingMessage) {
        console.log("Duplicate message detected, skipping");
        return;
      }

      // Add message to the messages array if it belongs to the current conversation
      if (
        state.selectedConversation &&
        msg.conversationId === state.selectedConversation._id
      ) {
        state.messages.push(msg);
      }
      // Update the conversation's last message and move it to the top
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === msg.conversationId
      );
      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        // Remove from current position
        state.conversations.splice(conversationIndex, 1);
        // Add to the beginning with updated last activity (as string)
        state.conversations.unshift({
          ...conversation,
          lastActivity: new Date().toISOString(),
        });
      }
      // Update unread count if not the current user's message and not in active chat
      if (msg.senderId !== state.activeChat) {
        const senderId = msg.senderId;
        state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
        // Recalculate total unread count
        state.totalUnreadCount = Object.values(state.unreadCounts).reduce(
          (sum, count) => sum + count,
          0
        );
      }
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUserState[]>) => {
      state.onlineUsers = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
      // Reset unread count when opening a chat
      state.unreadCounts[action.payload] = 0;
      // Recalculate total unread count
      state.totalUnreadCount = Object.values(state.unreadCounts).reduce(
        (sum, count) => sum + count,
        0
      );
    },
    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const senderId = action.payload;
      state.messages = state.messages.map((msg) => {
        if (msg.senderId === senderId && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      state.unreadCounts[senderId] = 0;
      // Recalculate total unread count
      state.totalUnreadCount = Object.values(state.unreadCounts).reduce(
        (sum, count) => sum + count,
        0
      );
    },
    updateMessageOptimistically: (state, action: PayloadAction<IMessage>) => {
      // Ensure createdAt/updatedAt are strings
      const msg = {
        ...action.payload,
      };
      state.messages.push(msg);
    },
    replaceOptimisticMessage: (
      state,
      action: PayloadAction<{ tempId: string; realMessage: IMessage }>
    ) => {
      // Replace temporary message with real message
      const messageIndex = state.messages.findIndex(
        (msg) => msg.id === action.payload.tempId
      );
      if (messageIndex !== -1) {
        state.messages[messageIndex] = action.payload.realMessage;
      }
    },
    removeOptimisticMessage: (state, action: PayloadAction<string>) => {
      // Remove temporary message (in case of error)
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
  },
});

export const {
  setConversations,
  setMessages,
  setSelectedConversation,
  addMessage,
  addRealTimeMessage,
  setOnlineUsers,
  setActiveChat,
  markMessagesAsRead,
  updateMessageOptimistically,
  replaceOptimisticMessage,
  removeOptimisticMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
