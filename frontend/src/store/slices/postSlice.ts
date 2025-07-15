import { IComment } from "@/types/comment.types";
import { ILikePostRTM, IUnlikePostRTM } from "@/types/like.types";
import { IFeedState, IPost } from "@/types/post.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IFeedState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  nextCursorComment: null,
  hasMoreComment: true,
  hasMorePost: true,
  nextCursorPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    appendPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
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

    setComment: (state, action) => {
      const { postId, comments, pagination } = action.payload;
      const post = state.posts.find((post) => post._id === postId);

      if (post) {
        // Replace comments for this post
        post.comments = comments;
        state.nextCursorComment = pagination.nextCursor;
        state.hasMoreComment = pagination.hasMore;
      }

      // Also update selectedPost if it matches
      if (state.selectedPost && state.selectedPost._id === postId) {
        state.selectedPost.comments = comments;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHasMorePost: (state, action: PayloadAction<boolean>) => {
      state.hasMorePost = action.payload;
    },
    setHasMoreComment: (state, action: PayloadAction<boolean>) => {
      state.hasMoreComment = action.payload;
    },
    resetFeed: (state) => {
      state.posts = [];
      state.nextCursorPost = null;
      state.hasMorePost = true;
      state.nextCursorComment = null;
      state.hasMoreComment = true;
      state.error = null;
    },
    setSelectedPost: (
      state,
      action: PayloadAction<
        IPost | null | { type: string; comment: IComment; postId: string }
      >
    ) => {
      if (action.payload === null) {
        state.selectedPost = null;
      } else if (
        typeof action.payload === "object" &&
        "type" in action.payload
      ) {
        // Handle adding comment to selected post
        if (action.payload.type === "ADD_COMMENT" && state.selectedPost) {
          if (!state.selectedPost.comments) {
            state.selectedPost.comments = [];
          }
          state.selectedPost.comments.unshift(action.payload.comment);
        }
      } else {
        // Handle setting the selected post
        state.selectedPost = action.payload as IPost;
      }
    },
  },
});

export const {
  setPosts,
  appendPosts,
  prependPosts,
  setLoading,
  setError,
  setHasMorePost,
  setHasMoreComment,
  resetFeed,
  likePost,
  unlikePost,
  setSelectedPost,
  setComment,
} = postSlice.actions;

export const postReducer = postSlice.reducer;
