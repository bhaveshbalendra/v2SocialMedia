import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.Api";
import { feedApi } from "./apis/feedApi.ts";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authReducer } from "./slices/auth.Slice";
import { uiReducer } from "./slices/ui.Slice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
