import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.Api";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authReducer } from "./slices/auth.Slice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
