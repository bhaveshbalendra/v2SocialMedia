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
      { page: number; limit: number }
    >({
      query: () => ({
        url: "/public",
        method: "GET",
        // params: { page, limit },
      }),
      providesTags: ["Post"],
    }),
    getAuthenticatedFeed: builder.query<
      IFeedApiResponse,
      { page: number; limit: number }
    >({
      query: () => ({
        url: "/feed",
        method: "GET",
        // params: { page, limit },
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
  }),
});

export const {
  useGetPublicFeedQuery,
  useGetAuthenticatedFeedQuery,
  useCreatePostMutation,
} = postApi;
