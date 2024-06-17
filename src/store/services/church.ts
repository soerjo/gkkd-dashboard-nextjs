import { IApiResponse } from "@/interfaces/apiResponse";
import {
  CreateChurch,
  GetChurchFilter,
  GetChurchResponse,
} from "@/interfaces/churchResponse";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/region",
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
        body: {
          name: payload.name,
          alt_name: payload.alt_name,
          location: payload.location,
        },
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
    GetAllChurch: builder.query<
      IApiResponse<GetChurchResponse>,
      GetChurchFilter
    >({
      query: payload => ({
        url: "/",
        method: "GET",
        params: payload,
      }),
    }),
    GetChurchById: builder.query<
      IApiResponse<GetChurchResponse>,
      { id: number }
    >({
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
  useGetChurchByIdQuery,
  useDeleteChurchMutation,
} = authApi;
