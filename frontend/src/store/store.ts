import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { chatApi } from "./apis/chatApi";
import { commentApi } from "./apis/commentApi";
import { followApi } from "./apis/followApi";
import { likeApi } from "./apis/likeApi";
import { notificationApi } from "./apis/notificationApi";
import { postApi } from "./apis/postApi";
import { profileApi } from "./apis/profileApi";
import { settingsApi } from "./apis/settingsApi";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authReducer } from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import { notificationReducer } from "./slices/notificationSlice";
import { postReducer } from "./slices/postSlice";
import { profileReducer } from "./slices/profileSlice";
import { settingsReducer } from "./slices/settingsSlice";
import { uiReducer } from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,

    [chatApi.reducerPath]: chatApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [followApi.reducerPath]: followApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    post: postReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)

      .concat(chatApi.middleware)
      .concat(commentApi.middleware)
      .concat(postApi.middleware)
      .concat(notificationApi.middleware)
      .concat(profileApi.middleware)
      .concat(followApi.middleware)
      .concat(settingsApi.middleware)
      .concat(likeApi.middleware)
      .concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
