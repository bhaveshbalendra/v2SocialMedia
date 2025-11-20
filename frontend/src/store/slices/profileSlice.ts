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
    // Optimistic follow update
    optimisticFollow: (
      state: IUserState,
      action: PayloadAction<{
        currentUserId: string;
        currentUserInfo: { username: string; profilePicture: string };
      }>
    ) => {
      if (state.userProfileData) {
        // Add current user to followers if not already there
        const isAlreadyFollowing = state.userProfileData.followers?.some(
          (f: { _id: string }) => f._id === action.payload.currentUserId
        );
        if (!isAlreadyFollowing) {
          if (!state.userProfileData.followers) {
            state.userProfileData.followers = [];
          }
          state.userProfileData.followers.push({
            _id: action.payload.currentUserId,
            username: action.payload.currentUserInfo.username,
            profilePicture: action.payload.currentUserInfo.profilePicture,
          });
        }
      }
    },
    // Optimistic unfollow update
    optimisticUnfollow: (
      state: IUserState,
      action: PayloadAction<{ currentUserId: string }>
    ) => {
      if (state.userProfileData) {
        // Remove current user from followers
        if (state.userProfileData.followers) {
          state.userProfileData.followers =
            state.userProfileData.followers.filter(
              (f: { _id: string }) => f._id !== action.payload.currentUserId
            );
        }
      }
    },
  },
});

export const {
  setUserProfile,
  setSelectedUser,
  setChatFriends,
  setIsLoading,
  setError,
  optimisticFollow,
  optimisticUnfollow,
} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
