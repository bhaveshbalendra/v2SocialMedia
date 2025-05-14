import { apiUrl } from "@/config/configs";
import {
  IAuthUserRouteResponse,
  ILoginRequest,
  ILoginResponseWithToken,
  ISignupRequest,
  ISignupResponseWithToken,
} from "@/types/auth.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponseWithToken, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // invalidatesTags: ["Auth"],
      transformResponse: (response: ILoginResponseWithToken) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
    signup: builder.mutation<ISignupResponseWithToken, ISignupRequest>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      // invalidatesTags: ["Auth"],
      transformResponse: (response: ISignupResponseWithToken) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
    authUserRoute: builder.query<IAuthUserRouteResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
      transformResponse: (response: IAuthUserRouteResponse) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useAuthUserRouteQuery } =
  authApi;
