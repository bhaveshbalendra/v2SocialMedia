// src/store/apis/feedApi.ts
import baseURL from "@/constants/baseurl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedApi = createApi({
  reducerPath: "feedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPublicFeed: builder.query({
      query: () => "/media/public",
    }),
    getAuthenticatedFeed: builder.query({
      query: () => "/media/feed",
    }),
  }),
});

export const { useGetPublicFeedQuery, useGetAuthenticatedFeedQuery } = feedApi;
