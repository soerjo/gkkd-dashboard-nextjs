import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { CreateCermon, CermonFilter, ICermon } from "@/interfaces/cermon.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cermonApi = createApi({
  reducerPath: "cermonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/cermon",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Cermon"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateCermon>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cermon"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<CreateCermon> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Cermon"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cermon"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<ICermon[]>>, CermonFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Cermon"],
    }),
    GetById: builder.query<IApiResponse<ICermon>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useGetAllQuery,
  useLazyGetAllQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useDeleteMutation,
} = cermonApi;
