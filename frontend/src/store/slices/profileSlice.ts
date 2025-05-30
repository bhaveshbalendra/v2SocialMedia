import { IUserProfileData } from "@/types/profile.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  userProfileData: IUserProfileData | null;
  selectedUser: IUserProfileData | null;
  chatFriends: IUserProfileData[];

  isLoading: boolean;
  error: string | null;
}

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userProfileData: null,
    selectedUser: null,
    chatFriends: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setUserProfile: (
      state: IUserState,
      action: PayloadAction<IUserProfileData>
    ) => {
      state.userProfileData = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setChatFriends: (state, action) => {
      state.chatFriends = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserProfile,
  setSelectedUser,
  setChatFriends,
  setIsLoading,
  setError,
} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
