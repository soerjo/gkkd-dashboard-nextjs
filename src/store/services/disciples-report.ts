import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateDisciplesReport,
  DisciplesReportFilter,
  IDisciplesReport,
} from "@/interfaces/disciples-report.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const disciplesReportApi = createApi({
  reducerPath: "disciplesReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/pemuridan-report",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["DisciplesReport"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateDisciplesReport>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DisciplesReport"],
    }),
    update: builder.mutation<
      IApiResponse<undefined>,
      Partial<CreateDisciplesReport> & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["DisciplesReport"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DisciplesReport"],
    }),
    GetAll: builder.query<
      IApiResponse<TPaginationResponse<IDisciplesReport[]>>,
      DisciplesReportFilter
    >({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["DisciplesReport"],
    }),
    GetById: builder.query<IApiResponse<IDisciplesReport>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    GetSyncById: builder.query<IApiResponse<void>, { id: number }>({
      query: ({ id }) => ({
        url: `/sync/${id}`,
        method: "GET",
      }),
    }),
    GetSyncAll: builder.query<IApiResponse<void>, { id: number }>({
      query: ({ id }) => ({
        url: `/sync/all`,
        method: "GET",
      }),
    }),
    getExport: builder.query({
      query: () => ({
        url: `/export`,
        responseType: "blob",
        responseHandler: async (response) => response.blob(),
      }),
    }),
    upload: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => ({
        url: "/upload",
        method: "POST",
        body: data,
        invalidatesTags: ["DisciplesReport"],
      }),
    }),
    getDashboard: builder.query({
      query: () => ({
        url: `/dashboard`,
        method: "GET",
      }),
      providesTags: ["DisciplesReport"],
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
  useLazyGetExportQuery,
  useUploadMutation,
  useGetDashboardQuery,
} = disciplesReportApi;
