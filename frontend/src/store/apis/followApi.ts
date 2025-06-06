import { apiUrl } from "@/config/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notificationApi } from "./notificationApi";

export interface SuggestedUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  isPrivate: boolean;
}

export interface SuggestedUsersResponse {
  success: boolean;
  data: SuggestedUser[];
}

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
    followUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (username) => ({
          url: `/${username}`,
          method: "POST",
        }),
        invalidatesTags: (_result, _error, username) => [
          { type: "Profile", id: username },
          { type: "Follow", id: "LIST" },
        ],
      }
    ),
    unfollowUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (username) => ({
        url: `/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, username) => [
        { type: "Profile", id: username },
        { type: "Follow", id: "LIST" },
      ],
    }),
    acceptFollowRequest: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (requestId) => ({
        url: `/requests/${requestId}/accept`,
        method: "PATCH",
      }),
      async onQueryStarted(requestId, { dispatch, queryFulfilled }) {
        dispatch(
          notificationApi.endpoints.removeFollowRequestNotification.initiate(
            requestId
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error accepting follow request:", error);
          dispatch(notificationApi.util.invalidateTags(["Notifications"]));
        }
      },
      invalidatesTags: ["Follow", "Profile"],
    }),
    rejectFollowRequest: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (requestId) => ({
        url: `/requests/${requestId}/reject`,
        method: "PATCH",
      }),
      async onQueryStarted(requestId, { dispatch, queryFulfilled }) {
        dispatch(
          notificationApi.endpoints.removeFollowRequestNotification.initiate(
            requestId
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error rejecting follow request:", error);
          dispatch(notificationApi.util.invalidateTags(["Notifications"]));
        }
      },
      invalidatesTags: ["Follow", "Profile"],
    }),
    getSuggestedUsers: builder.query<
      SuggestedUsersResponse,
      { limit?: number }
    >({
      query: ({ limit = 5 }) => ({
        url: "/suggestions",
        method: "GET",
        params: { limit },
      }),
      providesTags: ["Follow"],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation,
  useGetSuggestedUsersQuery,
} = followApi;
