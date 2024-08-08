import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateFellowshipReport,
  FellowshipReportFilter,
  IFellowshipReport,
  IFellowshipReportById,
} from "@/interfaces/fellowship-report.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fellowshipReportApi = createApi({
  reducerPath: "fellowshipReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/blesscomn-report",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["FellowshipReport"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateFellowshipReport>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FellowshipReport"],
    }),
    update: builder.mutation<
      IApiResponse<undefined>,
      Partial<CreateFellowshipReport> & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["FellowshipReport"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FellowshipReport"],
    }),
    GetAll: builder.query<
      IApiResponse<TPaginationResponse<IFellowshipReport[]>>,
      FellowshipReportFilter
    >({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["FellowshipReport"],
    }),
    GetById: builder.query<IApiResponse<IFellowshipReportById>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    getExport: builder.query({
      query: () => ({
        url: `/export`,
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
    }),
    upload: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => ({
        url: "/upload",
        method: "POST",
        body: data,
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
  useLazyGetExportQuery,
  useUploadMutation,
} = fellowshipReportApi;
