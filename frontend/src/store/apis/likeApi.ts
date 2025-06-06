// src/store/apis/feedApi.ts
import { apiUrl } from "@/config/configs";
import { RootState } from "@/store/store";
import {
  ILikePostApiRequest,
  ILikePostApiResponse,
  IUnlikePostApiRequest,
  IUnlikePostApiResponse,
} from "@/types/like.types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { postApi } from "./postApi";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${apiUrl}/likes`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  {
    maxRetries: 5, // You can change this value as needed
  }
);

export const likeApi = createApi({
  reducerPath: "likeApi",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    likePost: builder.mutation<ILikePostApiResponse, ILikePostApiRequest>({
      query: ({ postId }) => ({
        url: `/${postId}/likes`,
        method: "POST",
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled, getState }) {
        // Get current user ID from auth state
        const state = getState() as RootState;
        const userId = state.auth.user?._id;

        if (!userId) return;

        // Optimistic update for both public and authenticated feeds
        const patchResults = [
          dispatch(
            postApi.util.updateQueryData(
              "getPublicFeed",
              { page: 1, limit: 10 },
              (draft) => {
                const post = draft.posts.find((p) => p._id === postId);
                if (post && post.likes && !post.likes.includes(userId)) {
                  post.likes.push(userId);
                }
              }
            )
          ),
          dispatch(
            postApi.util.updateQueryData(
              "getAuthenticatedFeed",
              { page: 1, limit: 10 },
              (draft) => {
                const post = draft.posts.find((p) => p._id === postId);
                if (post && post.likes && !post.likes.includes(userId)) {
                  post.likes.push(userId);
                }
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on failure
          patchResults.forEach((patchResult) => patchResult.undo());
          toast.error("Failed to like post", {
            action: {
              label: "X",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
        }
      },
    }),

    unlikePost: builder.mutation<IUnlikePostApiResponse, IUnlikePostApiRequest>(
      {
        query: ({ postId }) => ({
          url: `/${postId}/unlike`,
          method: "DELETE",
        }),
        async onQueryStarted(
          { postId },
          { dispatch, queryFulfilled, getState }
        ) {
          // Get current user ID from auth state
          const state = getState() as RootState;
          const userId = state.auth.user?._id;

          if (!userId) return;

          // Optimistic update for both public and authenticated feeds
          const patchResults = [
            dispatch(
              postApi.util.updateQueryData(
                "getPublicFeed",
                { page: 1, limit: 10 },
                (draft) => {
                  const post = draft.posts.find((p) => p._id === postId);
                  if (post && post.likes) {
                    post.likes = post.likes.filter((id) => id !== userId);
                  }
                }
              )
            ),
            dispatch(
              postApi.util.updateQueryData(
                "getAuthenticatedFeed",
                { page: 1, limit: 10 },
                (draft) => {
                  const post = draft.posts.find((p) => p._id === postId);
                  if (post && post.likes) {
                    post.likes = post.likes.filter((id) => id !== userId);
                  }
                }
              )
            ),
          ];

          try {
            await queryFulfilled;
          } catch {
            // Revert optimistic updates on failure
            patchResults.forEach((patchResult) => patchResult.undo());
            toast.error("Failed to unlike post", {
              action: {
                label: "X",
                onClick: () => {
                  toast.dismiss();
                },
              },
            });
          }
        },
      }
    ),
  }),
});

export const { useLikePostMutation, useUnlikePostMutation } = likeApi;
