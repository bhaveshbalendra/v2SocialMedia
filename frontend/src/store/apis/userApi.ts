import { apiUrl } from "@/config/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/users`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "BlockedUsers"],
  endpoints: (builder) => ({
    blockUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/${userId}/block`,
        method: "POST",
      }),
      invalidatesTags: ["BlockedUsers"],
    }),
    unblockUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/${userId}/block`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlockedUsers"],
    }),
    deactivateAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/deactivate",
        method: "PATCH",
      }),
    }),
    reactivateAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/reactivate",
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useDeactivateAccountMutation,
  useReactivateAccountMutation,
} = userApi;
