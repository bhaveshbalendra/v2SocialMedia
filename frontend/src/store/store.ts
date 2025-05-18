import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi.ts";
import { postApi } from "./apis/postApi.ts";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authReducer } from "./slices/authSlice.ts";
import { postReducer } from "./slices/postSlice.ts";
import { uiReducer } from "./slices/uiSlice.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(postApi.middleware)
      .concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
