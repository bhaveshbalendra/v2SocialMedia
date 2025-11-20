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
        | IPost
        | null
        | {
            type: string;
            comment?: IComment;
            postId?: string;
            oldCommentId?: string;
            commentId?: string;
          }
      >
    ) => {
      if (action.payload === null) {
        state.selectedPost = null;
      } else if (
        typeof action.payload === "object" &&
        "type" in action.payload
      ) {
        if (!state.selectedPost) return;

        const postId = action.payload.postId;
        
        // Helper function to update comment count
        const updateCommentCount = (post: IPost, increment: number) => {
          // Initialize commentsCount if undefined based on comments array length
          if (post.commentsCount === undefined) {
            post.commentsCount = post.comments?.length || 0;
          }
          post.commentsCount = Math.max(0, post.commentsCount + increment);
        };
        
        // Handle adding comment to selected post
        if (action.payload.type === "ADD_COMMENT" && action.payload.comment) {
          if (!state.selectedPost.comments) {
            state.selectedPost.comments = [];
          }
          state.selectedPost.comments.unshift(action.payload.comment);
          updateCommentCount(state.selectedPost, 1);
          
          // Also update the post in the posts array
          const post = state.posts.find((p) => p._id === postId);
          if (post) {
            if (!post.comments) {
              post.comments = [];
            }
            post.comments.unshift(action.payload.comment);
            updateCommentCount(post, 1);
          }
        }
        // Handle replacing optimistic comment with real comment
        else if (
          action.payload.type === "REPLACE_COMMENT" &&
          "oldCommentId" in action.payload &&
          action.payload.oldCommentId &&
          "comment" in action.payload &&
          action.payload.comment
        ) {
          const oldCommentId = action.payload.oldCommentId;
          const comment = action.payload.comment;
          
          if (state.selectedPost.comments) {
            const index = state.selectedPost.comments.findIndex(
              (c) => c._id === oldCommentId
            );
            if (index !== -1) {
              state.selectedPost.comments[index] = comment;
            }
          }
          // Comment count stays the same (replacing, not adding)
          
          // Also update the post in the posts array
          const post = state.posts.find((p) => p._id === postId);
          if (post && post.comments) {
            const index = post.comments.findIndex(
              (c) => c._id === oldCommentId
            );
            if (index !== -1) {
              post.comments[index] = comment;
            }
          }
        }
        // Handle removing comment (on error)
        else if (
          action.payload.type === "REMOVE_COMMENT" &&
          "commentId" in action.payload &&
          action.payload.commentId
        ) {
          const commentId = action.payload.commentId;
          
          if (state.selectedPost.comments) {
            state.selectedPost.comments = state.selectedPost.comments.filter(
              (c) => c._id !== commentId
            );
          }
          updateCommentCount(state.selectedPost, -1);
          
          // Also update the post in the posts array
          const post = state.posts.find((p) => p._id === postId);
          if (post && post.comments) {
            post.comments = post.comments.filter(
              (c) => c._id !== commentId
            );
            updateCommentCount(post, -1);
          }
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
