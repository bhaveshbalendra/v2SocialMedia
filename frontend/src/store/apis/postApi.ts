// src/store/apis/feedApi.ts
import { apiUrl } from "@/config/configs";
import { FeedResponse, ICreatePostResponse } from "@/types/post.types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${apiUrl}/post`,
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
    getPublicFeed: builder.query<FeedResponse, { page: number; limit: number }>(
      {
        query: () => ({
          url: "/public",
          // params: { page, limit },
        }),
        providesTags: ["Post"],
      }
    ),
    getAuthenticatedFeed: builder.query<
      FeedResponse,
      { page: number; limit: number }
    >({
      query: () => ({
        url: "/public",
        // url: "/media/feed",
        // params: { page, limit },
      }),
      providesTags: ["Post"],
    }),
    createPost: builder.mutation<ICreatePostResponse, FormData>({
      query: (credentials) => ({
        url: "/create-post",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetPublicFeedQuery,
  useGetAuthenticatedFeedQuery,
  useCreatePostMutation,
} = postApi;
