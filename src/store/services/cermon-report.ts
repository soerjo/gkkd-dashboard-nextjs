import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateCermonReport,
  CermonReportFilter,
  ICermonReport,
} from "@/interfaces/cermon-report.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cermonReportApi = createApi({
  reducerPath: "cermonReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/cermon/report",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["CermonReport"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateCermonReport>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CermonReport"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<CreateCermonReport> & { id: number }>(
      {
        query: ({ id, ...payload }) => ({
          url: `/${id}`,
          method: "PATCH",
          body: payload,
        }),
        invalidatesTags: ["CermonReport"],
      }
    ),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CermonReport"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<ICermonReport[]>>, CermonReportFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["CermonReport"],
    }),
    GetById: builder.query<IApiResponse<ICermonReport>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["CermonReport"],
    }),
    GetSyncById: builder.mutation<IApiResponse<void>, { id: number }>({
      query: ({ id }) => ({
        url: `/sync/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["CermonReport"],
    }),
    GetSyncAll: builder.mutation<IApiResponse<void>, {}>({
      query: () => ({
        url: `/sync/all`,
        method: "GET",
      }),
      invalidatesTags: ["CermonReport"],
    }),
    getReminder: builder.query<IApiResponse<ICermonReport>, {}>({
      query: () => ({
        url: `/reminder`,
        method: "GET",
      }),
    }),
    upload: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CermonReport"],
    }),
    getExport: builder.query({
      query: () => ({
        url: `/export`,
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
    }),
    getDashboard: builder.query({
      query: () => ({
        url: `/dashboard`,
        method: "GET",
      }),
      providesTags: ["CermonReport"],
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
  useUploadMutation,
  useLazyGetExportQuery,
  useGetDashboardQuery,
  useLazyGetReminderQuery,
  useGetSyncByIdMutation,
  useGetSyncAllMutation,
} = cermonReportApi;
