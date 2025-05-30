import { apiUrl } from "@/config/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const followApi = createApi({
  reducerPath: "followApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/follows`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Follow", "Profile"],
  endpoints: (builder) => ({
    followUser: builder.mutation<void, string>({
      query: (username) => ({
        url: `/${username}/follow`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, username) => [
        { type: "Profile", id: username },
        { type: "Follow", id: "LIST" },
      ],
    }),
    unfollowUser: builder.mutation<void, string>({
      query: (username) => ({
        url: `/${username}/unfollow`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, username) => [
        { type: "Profile", id: username },
        { type: "Follow", id: "LIST" },
      ],
    }),
    acceptFollowRequest: builder.mutation<void, string>({
      query: (requestId) => ({
        url: `/${requestId}/accept-follow-request`,
        method: "PATCH",
      }),
      invalidatesTags: ["Follow", "Profile"],
    }),
    rejectFollowRequest: builder.mutation<void, string>({
      query: (requestId) => ({
        url: `/${requestId}/reject-follow-request`,
        method: "PATCH",
      }),
      invalidatesTags: ["Follow", "Profile"],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation,
  useUnfollowUserMutation,
} = followApi;
