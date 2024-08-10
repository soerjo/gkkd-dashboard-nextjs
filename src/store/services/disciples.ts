import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { CreateDisciples, DisciplesFilter, IDisciples } from "@/interfaces/disciples.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const disciplesApi = createApi({
  reducerPath: "disciplesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/pemuridan",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Disciples"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateDisciples>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Disciples"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<CreateDisciples> & { nim: string }>({
      query: ({ nim, ...payload }) => ({
        url: `/${nim}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Disciples"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { nim: string }>({
      query: ({ nim }) => ({
        url: `/${nim}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Disciples"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<IDisciples[]>>, DisciplesFilter>({
      query: (payload) => ({
        url: "/list",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Disciples"],
    }),
    GetAllList: builder.query<IApiResponse<TPaginationResponse<IDisciples[]>>, DisciplesFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["Disciples"],
    }),
    GetById: builder.query<IApiResponse<IDisciples>, { nim: string }>({
      query: ({ nim }) => ({
        url: `/${nim}`,
        method: "GET",
      }),
      providesTags: ["Disciples"],
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
  useLazyGetAllListQuery,
} = disciplesApi;
