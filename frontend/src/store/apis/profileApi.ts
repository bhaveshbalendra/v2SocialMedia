import { apiUrl } from "@/config/configs";
import {
  IGetUserProfileApiResponse,
  IGetUserSearchProfileApiResponse,
  IUserSearchProfileApiRequest,
} from "@/types/profile.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/profiles`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<IGetUserProfileApiResponse, string>({
      query: (username) => ({
        url: `/${username}`,
        method: "GET",
      }),
      providesTags: (_result, _error, username) => [
        { type: "Profile", id: username },
      ],
    }),
    searchUserProfiles: builder.query<
      IGetUserSearchProfileApiResponse,
      IUserSearchProfileApiRequest
    >({
      query: ({ searchTerm }) => ({
        url: "/search",
        method: "GET",
        params: { q: searchTerm },
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useLazySearchUserProfilesQuery } =
  profileApi;
