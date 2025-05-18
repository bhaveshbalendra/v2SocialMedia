import { Post } from "@/types/post.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface Post {
//   _id: string;
//   content: string;
//   media?: string[];
//   author: {
//     _id: string;
//     username: string;
//     profilePicture?: string;
//   };
//   likes: number;
//   comments: number;
//   createdAt: string;
//   updatedAt: string;
// }

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.page = 1;
    },
    appendPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...state.posts, ...action.payload];
      state.page += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    resetFeed: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  setLoading,
  setError,
  setHasMore,
  resetFeed,
} = postSlice.actions;

export const postReducer = postSlice.reducer;
