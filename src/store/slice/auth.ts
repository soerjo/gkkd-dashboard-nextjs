import { createSlice } from "@reduxjs/toolkit";
import {
  AUTH_PAYLOAD,
  AUTH_TOKEN,
  getAuthCookie,
  removeCookies,
  setAuthCookie,
} from "@/lib/cookies";
import { UserPayload } from "@/interfaces/loginResponse";
import { authApi } from "../services/auth";

const initialState: UserPayload = {} as UserPayload;

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      removeCookies([AUTH_TOKEN]);
      return {};
    },
    setInitialState: () => {
      const payload = getAuthCookie(AUTH_PAYLOAD);
      const token = getAuthCookie(AUTH_TOKEN);
      const data: UserPayload = payload && JSON.parse(payload);

      return { ...data, token };
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state = payload.data.payload;
          setAuthCookie(payload.data.jwt, AUTH_TOKEN);
          setAuthCookie(JSON.stringify(payload.data.payload), AUTH_PAYLOAD);
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { error, payload: data }) => {
          // FOR DEVELOPMENT =================
          const payload = {
            jwt: "dummy_token....",
            payload: {
              id: 0,
              email: "dummy@mail.com",
              region: {
                id: 1,
                name: "dummy region",
              },
              role: "SUPER_ADMIN",
              username: "dummy user",
              token: "dummy_token....",
              tempPassword: false,
            },
          };
          state = payload.payload;
          setAuthCookie(payload.jwt, AUTH_TOKEN);
          setAuthCookie(JSON.stringify(payload.payload), AUTH_PAYLOAD);
          // =================================
        }
      );
  },
});

export const { logout, setInitialState } = slice.actions;
export const authReducer = slice.reducer;
