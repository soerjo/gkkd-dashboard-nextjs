import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { ICreateHospitalityData, IFilterHospitalityData, IResponseHospitalityData } from "@/interfaces/hospitalityData.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hospitalityData = createApi({
  reducerPath: "hospitalityData",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/hospitality/data",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Hospitality"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, ICreateHospitalityData>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Hospitality"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<ICreateHospitalityData> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Hospitality"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hospitality"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<IResponseHospitalityData[]>>, IFilterHospitalityData>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Hospitality"],
      transformResponse: (response: IApiResponse<TPaginationResponse<IResponseHospitalityData[]>>) => {
        response.data.entities = response.data.entities.map((item) => ({
          ...item,
          isPresent: true,
        //   id: item.id,
        //   name: item.name,
        //   description: item.description,
        //   key: item.name,
        //   label: item.name,
        }));
        return response;
      }
    }),
    GetById: builder.query<IApiResponse<IResponseHospitalityData>, { id: number }>({
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
} = hospitalityData;
