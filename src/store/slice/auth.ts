import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { authApi } from '../services/auth';
import {
  AUTH_PAYLOAD,
  AUTH_TOKEN,
  getAuthCookie,
  removeCookies,
  setAuthCookie,
} from "@/lib/cookies";
import { LoginResponse, UserPayload } from "@/interfaces/loginResponse";
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
      const data: UserPayload = payload && JSON.parse(payload);

      return data;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state = payload.data.payload;
        console.log({ state });
        setAuthCookie(payload.data.jwt, AUTH_TOKEN);
        setAuthCookie(JSON.stringify(payload.data.payload), AUTH_PAYLOAD);
      }
    );
  },
});

export const { logout, setInitialState } = slice.actions;
export const authReducer = slice.reducer;
