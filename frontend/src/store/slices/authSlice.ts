import { IAuthUserState, User } from "@/types/auth.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IAuthUserState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;

      state.accessToken = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
    },
    logout: (state) => {
      state.user = null;

      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setIsLoading, setError } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
