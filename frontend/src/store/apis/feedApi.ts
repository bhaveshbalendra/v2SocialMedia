// src/store/apis/feedApi.ts
import { apiUrl } from "@/config/configs";
import { FeedResponse } from "@/types/feed.types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: apiUrl,
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

export const feedApi = createApi({
  reducerPath: "feedApi",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["Feed"],
  endpoints: (builder) => ({
    getPublicFeed: builder.query<FeedResponse, { page: number; limit: number }>(
      {
        query: () => ({
          url: "/post/public",
          // params: { page, limit },
        }),
        providesTags: ["Feed"],
      }
    ),
    getAuthenticatedFeed: builder.query<
      FeedResponse,
      { page: number; limit: number }
    >({
      query: () => ({
        url: "/post/public",
        // url: "/media/feed",
        // params: { page, limit },
      }),
      providesTags: ["Feed"],
    }),
  }),
});

export const { useGetPublicFeedQuery, useGetAuthenticatedFeedQuery } = feedApi;
