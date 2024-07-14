import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateMarital,
  IMarital,
  MaritalFilter,
  UpdateMarital,
} from "@/interfaces/marital.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const maritalApi = createApi({
  reducerPath: "MaritalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/marital",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Marital"],
  endpoints: builder => ({
    createMarital: builder.mutation<IApiResponse<undefined>, CreateMarital>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: {
          nijHusban: payload.husband_nij,
          nikHusban: payload.husband_nik,
          nijWife: payload.wife_nij,
          nikWife: payload.wife_nik,
          husband_name: payload.husband_name,
          wife_name: payload.wife_name,
          wedding_date: payload.wedding_date,
          pastor: payload.pastor,
          witness_1: payload.witness_1,
          witness_2: payload.witness_2,
          region_id: payload.region_id,
        },
      }),
      invalidatesTags: ["Marital"],
    }),
    updateMarital: builder.mutation<
      IApiResponse<undefined>,
      Partial<UpdateMarital> & { unique_code: string }
    >({
      query: ({ unique_code, ...payload }) => ({
        url: `/${unique_code}`,
        method: "PATCH",
        body: {
          nijHusban: payload.husband_nij ?? null,
          nikHusban: payload.husband_nik,
          nijWife: payload.wife_nij ?? null,
          nikWife: payload.wife_nik,
          husband_name: payload.husband_name,
          wife_name: payload.wife_name,
          wedding_date: payload.wedding_date,
          pastor: payload.pastor,
          witness_1: payload.witness_1,
          witness_2: payload.witness_2,
          // "photo_url": payload.photo_url,
          // "document_url": payload.document_url,
          region_id: payload.region_id,
        },
      }),
      invalidatesTags: ["Marital"],
    }),
    deleteMarital: builder.mutation<
      IApiResponse<undefined>,
      { unique_code: string }
    >({
      query: ({ unique_code }) => ({
        url: `/${unique_code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Marital"],
    }),
    GetAllMarital: builder.query<
      IApiResponse<TPaginationResponse<IMarital[]>>,
      MaritalFilter
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Marital"],
    }),
    GetMaritalById: builder.query<
      IApiResponse<IMarital>,
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
  useCreateMaritalMutation,
  useUpdateMaritalMutation,
  useGetAllMaritalQuery,
  useLazyGetAllMaritalQuery,
  useGetMaritalByIdQuery,
  useLazyGetMaritalByIdQuery,
  useDeleteMaritalMutation,
} = maritalApi;
