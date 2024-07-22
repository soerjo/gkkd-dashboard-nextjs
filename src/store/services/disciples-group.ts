import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { CreateGroup, GroupFilter, IGroup } from "@/interfaces/disciples-group.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const disciplesGroupApi = createApi({
  reducerPath: "disciplesGroupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/group/pemuridan",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["DisciplesGroup"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, CreateGroup>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DisciplesGroup"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<CreateGroup> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["DisciplesGroup"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DisciplesGroup"],
    }),
    GetAll: builder.query<IApiResponse<TPaginationResponse<IGroup[]>>, GroupFilter>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      providesTags: ["DisciplesGroup"],
    }),
    GetById: builder.query<IApiResponse<IGroup>, { id: number }>({
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
} = disciplesGroupApi;
