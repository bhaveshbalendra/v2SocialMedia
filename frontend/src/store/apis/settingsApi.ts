import { apiUrl } from "@/config/configs";
import { Settings } from "@/types/settings.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UpdatePrivacyRequest {
  isPrivate: boolean;
}

interface UpdateNotificationsRequest {
  email?: boolean;
  push?: boolean;
}

interface UpdateProfileRequest {
  username?: string;
  email?: string;
  password?: string;
}

interface UpdateSettingsResponse {
  success: boolean;
  message: string;
}

interface GetSettingsResponse {
  message: string;
  success: boolean;

  settings: Settings;
}

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/settings`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getUserSettings: builder.query<GetSettingsResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),

    updatePrivacy: builder.mutation<
      UpdateSettingsResponse,
      UpdatePrivacyRequest
    >({
      query: (body) => ({
        url: "/privacy",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    updateNotifications: builder.mutation<
      UpdateSettingsResponse,
      UpdateNotificationsRequest
    >({
      query: (body) => ({
        url: "/settings/notifications",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    updateProfile: builder.mutation<
      UpdateSettingsResponse,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/settings/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    upgradeAccount: builder.mutation<
      UpdateSettingsResponse,
      { isPremium: boolean }
    >({
      query: (body) => ({
        url: "/settings/premium",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetUserSettingsQuery,
  useUpdatePrivacyMutation,
  useUpdateNotificationsMutation,
  useUpdateProfileMutation,
  useUpgradeAccountMutation,
} = settingsApi;
