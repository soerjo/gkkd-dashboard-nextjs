import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { ICreateHospitalityReport, IFilterHospitalityReport, IHospitalityReportSundayService, IHospitalRegenerateReport, IReponseSundayServiceReport, IResponseHospitalityReport } from "@/interfaces/hospitalityReport.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hospitalityReport = createApi({
  reducerPath: "hospitalityReport",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/hospitality/report",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["HospitalityReport", "MyHospitalityReport"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, ICreateHospitalityReport>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MyHospitalityReport"],
    }),
    regenerate: builder.mutation<IApiResponse<undefined>, IHospitalRegenerateReport>({
      query: (payload) => ({
        url: "/regenerate",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["MyHospitalityReport"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<ICreateHospitalityReport> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["MyHospitalityReport"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, ICreateHospitalityReport>({
      query: (payload) => ({
        url: `/delete`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["MyHospitalityReport"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<IResponseHospitalityReport[]>>, IFilterHospitalityReport>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["HospitalityReport"],
      transformResponse: (response: IApiResponse<TPaginationResponse<IResponseHospitalityReport[]>>) => {
        response.data.entities = response.data.entities.map((item) => ({
          ...item,
        }));
        return response;
      }
    }),
    GetById: builder.query<IApiResponse<IResponseHospitalityReport>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    GetReport: builder.query<IReponseSundayServiceReport, IFilterHospitalityReport>({
      query: (payload) => ({
        url: `/sunday-service`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["HospitalityReport","MyHospitalityReport"],
      transformResponse: (response: IApiResponse<IReponseSundayServiceReport>) => {
        return response.data
      }
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useGetAllQuery,
  useGetReportQuery,
  useLazyGetAllQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useDeleteMutation,
  useRegenerateMutation,
} = hospitalityReport;
