import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateBaptism,
  FilterBaptism,
  IBaptism,
} from "@/interfaces/baptism.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baptismApi = createApi({
  reducerPath: "baptismApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/baptisan",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Baptism"],
  endpoints: builder => ({
    create: builder.mutation<IApiResponse<undefined>, CreateBaptism>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Baptism"],
    }),
    update: builder.mutation<
      IApiResponse<undefined>,
      Partial<CreateBaptism> & { unique_code: string }
    >({
      query: ({ unique_code, ...payload }) => ({
        url: `/${unique_code}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Baptism"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { unique_code: string }>({
      query: ({ unique_code }) => ({
        url: `/${unique_code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Baptism"],
    }),
    GetAll: builder.query<
      IApiResponse<TPaginationResponse<IBaptism[]>>,
      FilterBaptism
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Baptism"],
    }),
    GetById: builder.query<IApiResponse<IBaptism>, { unique_code: string }>({
      query: ({ unique_code }) => ({
        url: `/${unique_code}`,
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
} = baptismApi;
