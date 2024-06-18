import { IApiResponse, Role } from "@/interfaces/apiResponse";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const myParamApi = createApi({
  reducerPath: "myParamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/parameter",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    GetParams: builder.query<IApiResponse<Role[]>, { param: string }>({
      query: ({ param }) => ({
        url: `/${param}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetParamsQuery } = myParamApi;
