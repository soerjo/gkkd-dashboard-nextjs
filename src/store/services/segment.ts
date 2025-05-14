import { IApiResponse } from "@/interfaces/apiResponse";
import { ICreateSegment, IFilterSegment, IMappingSegment, IResponseSegment } from "@/interfaces/segment.interface";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const segmentApi = createApi({
  reducerPath: "segmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/segment",
    prepareHeaders: (headers) => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Segment"],
  endpoints: (builder) => ({
    create: builder.mutation<IApiResponse<undefined>, ICreateSegment>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Segment"],
    }),
    update: builder.mutation<IApiResponse<undefined>, Partial<ICreateSegment> & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Segment"],
    }),
    delete: builder.mutation<IApiResponse<undefined>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Segment"],
    }),
    GetAll: builder.query<IMappingSegment[], IFilterSegment>({
      query: (payload) => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
      keepUnusedDataFor: 300,
      providesTags: ["Segment"],
      transformResponse: (response: IApiResponse<IResponseSegment[]>) => {
        return response.data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          description: item.description,
          key: item.name,
          label: item.name,
        }));
      }
    }),
    GetById: builder.query<IApiResponse<IResponseSegment>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
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
} = segmentApi;
