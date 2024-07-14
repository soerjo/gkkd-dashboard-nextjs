import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateChildDedication,
  FilterChildDedication,
  IChildDedication,
} from "@/interfaces/child-dedication.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const childDedicationApi = createApi({
  reducerPath: "childDedicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/penyerahan-anak",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ChildDedication"],
  endpoints: builder => ({
    create: builder.mutation<
      IApiResponse<undefined>,
      Omit<CreateChildDedication, "region_id">
    >({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ChildDedication"],
    }),
    update: builder.mutation<
      IApiResponse<undefined>,
      Partial<CreateChildDedication> & { unique_code: string }
    >({
      query: ({ unique_code, ...payload }) => ({
        url: `/${unique_code}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ChildDedication"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { unique_code: string }>({
      query: ({ unique_code }) => ({
        url: `/${unique_code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChildDedication"],
    }),
    GetAll: builder.query<
      IApiResponse<TPaginationResponse<IChildDedication[]>>,
      FilterChildDedication
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["ChildDedication"],
    }),
    GetById: builder.query<
      IApiResponse<IChildDedication>,
      { unique_code: string }
    >({
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
} = childDedicationApi;
