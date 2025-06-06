import { apiUrl } from "@/config/configs";
import { ICreatePostApiResponse, IFeedApiResponse } from "@/types/post.types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${apiUrl}/posts`,
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

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPublicFeed: builder.query<
      IFeedApiResponse,
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit = 5 }) => ({
        url: "/public",
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: ["Post"],
    }),
    getAuthenticatedFeed: builder.query<
      IFeedApiResponse,
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit = 5 }) => ({
        url: "/feed",
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: ["Post"],
    }),
    createPost: builder.mutation<ICreatePostApiResponse, FormData>({
      query: (credentials) => ({
        url: "/create-post",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation<
      { success: boolean; message: string },
      { postId: string }
    >({
      query: ({ postId }) => ({
        url: `/${postId}/delete`,
        method: "DELETE",
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // Optimistic update: remove post from both feeds
        const patchResults = [
          dispatch(
            postApi.util.updateQueryData(
              "getPublicFeed",
              { limit: 5 },
              (draft) => {
                draft.posts = draft.posts.filter((post) => post._id !== postId);
              }
            )
          ),
          dispatch(
            postApi.util.updateQueryData(
              "getAuthenticatedFeed",
              { limit: 5 },
              (draft) => {
                draft.posts = draft.posts.filter((post) => post._id !== postId);
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on failure
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPublicFeedQuery,
  useGetAuthenticatedFeedQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLazyGetPublicFeedQuery,
  useLazyGetAuthenticatedFeedQuery,
} = postApi;
