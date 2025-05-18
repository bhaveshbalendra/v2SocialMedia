import { apiUrl } from "@/config/configs";
import {
  IAuthUserRouteResponse,
  IGoogleAuthRequest,
  IGoogleAuthResponseWithToken,
  ILoginRequest,
  ILoginResponseWithToken,
  ILogoutResponse,
  ISignupRequest,
  ISignupResponseWithToken,
} from "@/types/auth.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/auth`,
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
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: ILoginResponseWithToken) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
    signup: builder.mutation<ISignupResponseWithToken, ISignupRequest>({
      query: (credentials) => ({
        url: "/signup",
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
    google: builder.mutation<IGoogleAuthResponseWithToken, IGoogleAuthRequest>({
      query: (credentials) => ({
        url: "/google",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    authUserRoute: builder.query<IAuthUserRouteResponse, void>({
      query: () => ({
        url: "/me",
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

export const {
  useLoginMutation,
  useSignupMutation,
  useAuthUserRouteQuery,
  useLogoutMutation,
  useGoogleMutation,
} = authApi;
