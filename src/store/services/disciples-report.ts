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
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/report/pemuridan",
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
      Partial<CreateDisciplesReport> & { nim: string }
    >({
      query: ({ nim, ...payload }) => ({
        url: `/${nim}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["DisciplesReport"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { nim: string }>({
      query: ({ nim }) => ({
        url: `/${nim}`,
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
    GetById: builder.query<IApiResponse<IDisciplesReport>, { nim: string }>({
      query: ({ nim }) => ({
        url: `/${nim}`,
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
} = disciplesReportApi;
