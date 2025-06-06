import { ILikePostRTM, IUnlikePostRTM } from "@/types/like.types";
import { IFeedState, IPost } from "@/types/post.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IFeedState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
      state.page = 1;
    },
    appendPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
      state.page += 1;
    },
    prependPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...action.payload, ...state.posts];
    },
    likePost: (state, action: PayloadAction<ILikePostRTM>) => {
      const post = state.posts.find(
        (post) => post._id === action.payload?.postId
      );
      if (post) {
        post.likes?.push(action.payload?.userId);
      }
      if (state.selectedPost?._id === action.payload?.postId) {
        state.selectedPost.likes?.push(action.payload?.userId);
      }
    },
    unlikePost: (state, action: PayloadAction<IUnlikePostRTM>) => {
      const post = state.posts.find(
        (post) => post._id === action.payload?.postId
      );
      if (post) {
        post.likes = post.likes?.filter(
          (userId) => userId !== action.payload?.userId
        );
      }
      if (state.selectedPost?._id === action.payload?.postId) {
        state.selectedPost.likes = state.selectedPost.likes?.filter(
          (userId) => userId !== action.payload?.userId
        );
      }
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
    setSelectedPost: (state, action: PayloadAction<IPost | null>) => {
      state.selectedPost = action.payload;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  prependPosts,
  setLoading,
  setError,
  setHasMore,
  resetFeed,
  likePost,
  unlikePost,
  setSelectedPost,
} = postSlice.actions;

export const postReducer = postSlice.reducer;
