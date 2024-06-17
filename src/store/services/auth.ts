import { IApiResponse } from "@/interfaces/apiResponse";
import { LoginResponse } from "@/interfaces/loginResponse";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/auth",
  }),
  endpoints: builder => ({
    login: builder.mutation<
      IApiResponse<LoginResponse>,
      { usernameOrEmail: string; password: string }
    >({
      query: ({ usernameOrEmail, password }) => ({
        url: "/login",
        method: "POST",
        body: {
          usernameOrEmail,
          password,
        },
      }),
    }),
    authLogin: builder.query<
      IApiResponse<LoginResponse>,
      { usernameOrEmail: string; password: string }
    >({
      query: ({ usernameOrEmail, password }) => ({
        url: "/login",
        method: "POST",
        body: {
          usernameOrEmail,
          password,
        },
      }),
    }),
    getAuthData: builder.query<IApiResponse<LoginResponse>, { token: string }>({
      query: ({ token }) => ({
        url: "/details",
        // this is the default but I'm leaving it here for reference
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetAuthDataQuery, useAuthLoginQuery } =
  authApi;
