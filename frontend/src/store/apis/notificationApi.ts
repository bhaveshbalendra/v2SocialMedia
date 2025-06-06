import { apiUrl } from "@/config/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { INotificationResponse } from "../../types/notification.types";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/notifications`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<INotificationResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (notificationId) => ({
          url: `/${notificationId}/read`,
          method: "PATCH",
        }),
        // Optimistic removal - remove notification from list when marked as read
        async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            notificationApi.util.updateQueryData(
              "getNotifications",
              undefined,
              (draft) => {
                // Remove the notification from the list
                draft.notifications = draft.notifications.filter(
                  (n) => n._id !== notificationId
                );
              }
            )
          );

          try {
            await queryFulfilled;
          } catch {
            // Revert the optimistic update on error
            patchResult.undo();
          }
        },
      }
    ),

    markAllAsRead: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/read-all",
        method: "PATCH",
      }),
      // Optimistic removal - remove all unread notifications from list
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              // Remove all unread notifications from the list
              draft.notifications = draft.notifications.filter(
                (notification) => notification.read === true
              );
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert the optimistic update on error
          patchResult.undo();
        }
      },
    }),

    deleteNotification: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: "DELETE",
      }),
      // Optimistic update handling
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        // Update the cache optimistically
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              draft.notifications = draft.notifications.filter(
                (n) => n._id !== notificationId
              );
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert the optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Helper mutation for optimistic removal of follow request notifications
    removeFollowRequestNotification: builder.mutation<void, string>({
      queryFn: () => ({ data: undefined }), // This is a client-side only mutation
      async onQueryStarted(requestId, { dispatch }) {
        // Optimistically remove follow request notifications
        dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              draft.notifications = draft.notifications.filter(
                (n) =>
                  !(
                    n.entityModel === "FollowRequest" &&
                    n.entityId === requestId &&
                    n.type === "FOLLOW_REQUEST"
                  )
              );
            }
          )
        );
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useRemoveFollowRequestNotificationMutation,
} = notificationApi;
