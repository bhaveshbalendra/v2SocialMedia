import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  INotification,
  NotificationsState,
  SocketNotificationEvent,
} from "../../types/notification.types";

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (notification) => !notification.read
      ).length;
    },
    addNotification: (
      state,
      action: PayloadAction<SocketNotificationEvent>
    ) => {
      // Create a new notification from the socket event
      const newNotification: INotification = {
        ...action.payload,
        read: false,
        updatedAt: action.payload.createdAt,
      };

      // Add to the beginning of the array
      state.notifications = [newNotification, ...state.notifications];
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (item) => item._id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((item) => ({
        ...item,
        read: true,
      }));
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const wasUnread =
        state.notifications.find((item) => item._id === action.payload)
          ?.read === false;
      state.notifications = state.notifications.filter(
        (item) => item._id !== action.payload
      );
      if (wasUnread) {
        state.unreadCount -= 1;
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,

  clearNotifications,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
