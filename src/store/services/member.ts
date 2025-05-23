import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  Member,
  GetMemberFilter,
  MemberResponse,
  CreateMember,
  MemberDetail,
  UpdateMember,
} from "@/interfaces/memberResponse";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/jemaat",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Member"],
  endpoints: (builder) => ({
    createMember: builder.mutation<IApiResponse<undefined>, CreateMember>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Member"],
    }),
    updateMember: builder.mutation<IApiResponse<undefined>, UpdateMember>({
      query: ({ nij, ...payload }) => ({
        url: `/${nij}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Member"],
    }),
    deleteMember: builder.mutation<IApiResponse<undefined>, { nij: string }>({
      query: ({ nij }) => ({
        url: `/${nij}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Member"],
    }),
    GetAllMember: builder.query<
      IApiResponse<TPaginationResponse<MemberResponse[]>>,
      GetMemberFilter
    >({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Member"],
    }),
    GetMemberById: builder.query<IApiResponse<MemberDetail>, { nij: string }>({
      query: ({ nij }) => ({
        url: `/${nij}`,
        method: "GET",
      }),
      providesTags: ["Member"],
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
