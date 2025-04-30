import { IAuthUser } from "@/types/auth.types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IAuthUser = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("token", accessToken);
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setAuthLoading, setAuthError } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
