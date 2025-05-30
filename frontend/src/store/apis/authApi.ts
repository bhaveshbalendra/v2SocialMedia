import { apiUrl } from "@/config/configs";
import {
  IAuthUserRouteApiResponse,
  IGoogleAuthApiRequest,
  IGoogleAuthApiResponseWithToken,
  ILoginApiRequest,
  ILoginApiResponseWithToken,
  ILogoutApiResponse,
  ISignupApiRequest,
  ISignupApiResponseWithToken,
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
    login: builder.mutation<ILoginApiResponseWithToken, ILoginApiRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: ILoginApiResponseWithToken) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
    signup: builder.mutation<ISignupApiResponseWithToken, ISignupApiRequest>({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ISignupApiResponseWithToken) => {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        return response;
      },
    }),
    google: builder.mutation<
      IGoogleAuthApiResponseWithToken,
      IGoogleAuthApiRequest
    >({
      query: (credentials) => ({
        url: "/google",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<ILogoutApiResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    authUserRoute: builder.query<IAuthUserRouteApiResponse, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      // Skip caching to ensure we always get a fresh token
      keepUnusedDataFor: 0,
      providesTags: (result) => (result ? ["Auth"] : []),
      transformResponse: (response: IAuthUserRouteApiResponse) => {
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
