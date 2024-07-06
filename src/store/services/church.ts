import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateChurch,
  GetChurchFilter,
  GetChurchResponse,
} from "@/interfaces/churchResponse";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const churchApi = createApi({
  reducerPath: "churchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/region",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    createChurch: builder.mutation<IApiResponse<GetChurchFilter>, CreateChurch>(
      {
        query: payload => ({
          url: "/",
          method: "POST",
          body: {
            name: payload.name,
            alt_name: payload.alt_name,
            location: payload.location,
            parent_id: payload?.parent_id,
          },
        }),
      }
    ),
    updateChurch: builder.mutation<
      IApiResponse<GetChurchFilter>,
      CreateChurch & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    deleteChurch: builder.mutation<
      IApiResponse<GetChurchFilter>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    restoreChurch: builder.mutation<
      IApiResponse<GetChurchFilter>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/restore/${id}`,
        method: "POST",
      }),
    }),
    GetAllChurch: builder.query<
      IApiResponse<TPaginationResponse<GetChurchResponse[]>>,
      GetChurchFilter
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
    }),
    GetChurchById: builder.query<IApiResponse<CreateChurch>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateChurchMutation,
  useUpdateChurchMutation,
  useGetAllChurchQuery,
  useLazyGetAllChurchQuery,
  useGetChurchByIdQuery,
  useLazyGetChurchByIdQuery,
  useDeleteChurchMutation,
  useRestoreChurchMutation,
} = churchApi;
