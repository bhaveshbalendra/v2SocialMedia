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
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<IConversation | null>
    ) => {
      state.selectedConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);

      // If this is a message to the current user and not from the active chat,
      // increment the unread count
      if (action.payload.senderId !== state.activeChat) {
        const senderId = action.payload.senderId;
        state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
      }
    },
    addRealTimeMessage: (state, action: PayloadAction<IMessage>) => {
      // Check if this message already exists (prevent duplicates)
      const existingMessage = state.messages.find(
        (msg) =>
          msg.id === action.payload.id ||
          (msg.content === action.payload.content &&
            msg.senderId === action.payload.senderId &&
            Math.abs(
              new Date(msg.createdAt || "").getTime() -
                new Date(action.payload.createdAt || "").getTime()
            ) < 5000)
      );

      if (existingMessage) {
        console.log("Duplicate message detected, skipping");
        return;
      }

      // Add message to the messages array if it belongs to the current conversation
      if (
        state.selectedConversation &&
        action.payload.conversationId === state.selectedConversation._id
      ) {
        state.messages.push(action.payload);
      }

      // Update the conversation's last message and move it to the top
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === action.payload.conversationId
      );

      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        // Remove from current position
        state.conversations.splice(conversationIndex, 1);
        // Add to the beginning with updated last activity
        state.conversations.unshift({
          ...conversation,
          lastActivity: new Date().toISOString(),
        });
      }

      // Update unread count if not the current user's message and not in active chat
      if (action.payload.senderId !== state.activeChat) {
        const senderId = action.payload.senderId;
        state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
      }
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUserState[]>) => {
      state.onlineUsers = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
      // Reset unread count when opening a chat
      state.unreadCounts[action.payload] = 0;
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
    },
    updateMessageOptimistically: (state, action: PayloadAction<IMessage>) => {
      // Add the message immediately for optimistic updates
      state.messages.push(action.payload);
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
