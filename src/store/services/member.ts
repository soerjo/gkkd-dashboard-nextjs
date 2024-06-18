import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  Member,
  GetMemberFilter,
  MemberResponse,
} from "@/interfaces/memberResponse";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/jemaat",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    createMember: builder.mutation<IApiResponse<undefined>, Member>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
    }),
    updateMember: builder.mutation<
      IApiResponse<undefined>,
      Member & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    deleteMember: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    GetAllMember: builder.query<
      IApiResponse<TPaginationResponse<MemberResponse[]>>,
      GetMemberFilter
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
    }),
    GetMemberById: builder.query<IApiResponse<MemberResponse>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useGetAllMemberQuery,
  useLazyGetAllMemberQuery,
  useGetMemberByIdQuery,
  useLazyGetMemberByIdQuery,
  useDeleteMemberMutation,
} = memberApi;
