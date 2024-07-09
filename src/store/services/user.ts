import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateUser,
  GetUserFilter,
  GetUserResponse,
} from "@/interfaces/userResponse";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/admin",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    createUser: builder.mutation<IApiResponse<GetUserFilter>, CreateUser>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
    }),
    updateUser: builder.mutation<
      IApiResponse<GetUserFilter>,
      CreateUser & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
    }),
    resetUserPassword: builder.mutation<
      IApiResponse<undefined>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `${id}/reset-password`,
        method: "PATCH",
      }),
    }),
    updateUserPassword: builder.mutation<
      IApiResponse<undefined>,
      { new_password: string }
    >({
      query: payload => ({
        url: `/update-password`,
        method: "PATCH",
        body: payload,
      }),
    }),
    deleteUser: builder.mutation<IApiResponse<GetUserFilter>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    restoreUser: builder.mutation<IApiResponse<GetUserFilter>, { id: number }>({
      query: ({ id }) => ({
        url: `/restore/${id}`,
        method: "POST",
      }),
    }),
    GetAllUser: builder.query<
      IApiResponse<TPaginationResponse<GetUserResponse[]>>,
      GetUserFilter
    >({
      query: payload => {
        return {
          url: "/",
          method: "GET",
          params: payload,
        };
      },
    }),
    GetUserById: builder.query<IApiResponse<GetUserResponse>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetAllUserQuery,
  useLazyGetAllUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useUpdateUserPasswordMutation,
  useResetUserPasswordMutation,
} = userApi;
