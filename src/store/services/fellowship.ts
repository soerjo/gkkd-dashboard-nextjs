import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateFellowship,
  FellowshipFilter,
  IFellowship,
  IFellowshipById,
} from "@/interfaces/fellowship.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fellowshipApi = createApi({
  reducerPath: "fellowshipApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/blesscomn",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Fellowship"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateFellowship>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Fellowship"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<CreateFellowship> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Fellowship"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fellowship"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<IFellowship[]>>, FellowshipFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      keepUnusedDataFor: 300,
      providesTags: ["Fellowship"],
    }),
    GetAllMap: builder.query<IFellowship[], FellowshipFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: {...payload, take: 1000},
      }),
      keepUnusedDataFor: 300,
      providesTags: ["Fellowship"],
      transformResponse: (response: IApiResponse<TPaginationResponse<IFellowship[]>>) => {
        return response.data.entities.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
        }));
      }

    }),
    GetById: builder.query<IApiResponse<IFellowshipById>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      providesTags: ["Fellowship"],
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useGetAllQuery,
  useGetAllMapQuery,
  useLazyGetAllQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useDeleteMutation,
} = fellowshipApi;
