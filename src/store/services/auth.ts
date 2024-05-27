import { IApiResponse } from "@/interfaces/apiResponse";
import { LoginResponse } from "@/interfaces/loginResponse";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL
        : window.location.origin,
  }),
  endpoints: builder => ({
    login: builder.mutation<
      IApiResponse<LoginResponse>,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "/api/login",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
    getAuthData: builder.query<IApiResponse<LoginResponse>, { token: string }>({
      query: ({ token }) => ({
        url: "api/auth-details",
        // this is the default but I'm leaving it here for reference
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetAuthDataQuery } = authApi;
