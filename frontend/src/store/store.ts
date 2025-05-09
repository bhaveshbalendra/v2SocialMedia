import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi.ts";
import { feedApi } from "./apis/feedApi.ts";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authReducer } from "./slices/authSlice.ts";
import { feedReducer } from "./slices/feedSlice.ts";
import { uiReducer } from "./slices/uiSlice.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(feedApi.middleware)
      .concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
