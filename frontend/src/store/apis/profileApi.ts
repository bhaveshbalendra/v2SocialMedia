import { apiUrl } from "@/config/configs";
import { IGetUserProfileApiResponse } from "@/types/profile.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SearchUsersResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    isPrivate: boolean;
  }[];
}

interface FollowStatusResponse {
  success: boolean;
  data: {
    status: "following" | "not_following" | "requested" | "private";
  };
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Profile", "FollowStatus"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<IGetUserProfileApiResponse, string>({
      query: (username) => ({
        url: `/profiles/${username}`,
        method: "GET",
      }),
      providesTags: (_result, _error, username) => [
        { type: "Profile", id: username },
      ],
    }),
    searchUsers: builder.query<
      SearchUsersResponse,
      { q: string; limit?: number }
    >({
      query: ({ q, limit = 10 }) => ({
        url: "/profiles/search",
        method: "GET",
        params: { q, limit },
      }),
    }),
    checkFollowStatus: builder.query<FollowStatusResponse, string>({
      query: (userId) => ({
        url: `/follows/check/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "FollowStatus", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useCheckFollowStatusQuery,
} = profileApi;
