import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, MessageState, OnlineUserState } from "@/types/chat.types";

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  activeChat: null,
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessageState[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessageState>) => {
      state.messages.push(action.payload);

      // If this is a message to the current user and not from the active chat,
      // increment the unread count
      if (
        action.payload.receiverId === "currentUserId" &&
        action.payload.senderId !== state.activeChat
      ) {
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
        if (msg.senderId === senderId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      state.unreadCounts[senderId] = 0;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setOnlineUsers,
  setActiveChat,
  markMessagesAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
