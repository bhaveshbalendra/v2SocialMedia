import { apiUrl } from "@/config/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types for comments
export interface IComment {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  post: string;
  content: string;
  likes: string[];
  likesCount: number;
  parentComment?: string;
  replies?: IComment[];
  repliesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCommentRequest {
  content: string;
}

export interface ICreateCommentResponse {
  success: boolean;
  message: string;
  comment: IComment;
}

export interface IGetCommentsResponse {
  success: boolean;
  message: string;
  comments: IComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface IGetRepliesResponse {
  success: boolean;
  message: string;
  replies: IComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface ICommentLikeResponse {
  success: boolean;
  message: string;
  isLiked: boolean;
}

export interface IUpdateCommentRequest {
  content: string;
}

export interface IUpdateCommentResponse {
  success: boolean;
  message: string;
  comment: IComment;
}

export interface IDeleteCommentResponse {
  success: boolean;
  message: string;
}

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/comments`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Comments", "Comment"],
  endpoints: (builder) => ({
    // Create a comment on a post
    createComment: builder.mutation<
      ICreateCommentResponse,
      { postId: string; content: string }
    >({
      query: ({ postId, content }) => ({
        url: `/${postId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comments"],
    }),

    // Create a reply to a comment
    createReply: builder.mutation<
      ICreateCommentResponse,
      { commentId: string; content: string }
    >({
      query: ({ commentId, content }) => ({
        url: `/${commentId}/reply`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comments"],
    }),

    // Get comments for a post
    getPostComments: builder.query<
      IGetCommentsResponse,
      { postId: string; page?: number; limit?: number }
    >({
      query: ({ postId, page = 1, limit = 20 }) => ({
        url: `/${postId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    // Get replies for a comment
    getCommentReplies: builder.query<
      IGetRepliesResponse,
      { commentId: string; page?: number; limit?: number }
    >({
      query: ({ commentId, page = 1, limit = 10 }) => ({
        url: `/${commentId}/replies?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    // Update a comment
    updateComment: builder.mutation<
      IUpdateCommentResponse,
      { commentId: string; content: string }
    >({
      query: ({ commentId, content }) => ({
        url: `/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Comment", id: commentId },
        "Comments",
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<IDeleteCommentResponse, string>({
      query: (commentId) => ({
        url: `/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    // Like/Unlike a comment
    toggleCommentLike: builder.mutation<ICommentLikeResponse, string>({
      query: (commentId) => ({
        url: `/${commentId}/like`,
        method: "POST",
      }),
      // Optimistic update for better UX
      async onQueryStarted(commentId, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Could add optimistic updates here if needed
        } catch {
          // Handle error
        }
      },
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useGetPostCommentsQuery,
  useGetCommentRepliesQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
} = commentApi;
