import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { authApi } from '../services/auth';
import { AUTH_TOKEN, removeCookies, setAuthCookie } from "@/lib/cookies";
import { LoginResponse } from "@/interfaces/loginResponse";
import { authApi } from "../services/auth";

const initialState: Partial<LoginResponse> = {};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      removeCookies([AUTH_TOKEN]);
      return {};
    },
    login: (
      state,
      { payload }: PayloadAction<{ email: string; password: string }>
    ) => {
      setAuthCookie(JSON.stringify(payload), AUTH_TOKEN);
      return {
        ...state,
        userEmail: payload.email,
        userName: payload.email.split("@")[0],
      };
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (_state, { payload }) => {
        setAuthCookie(payload.data.token, AUTH_TOKEN);
        return payload.data;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getAuthData.matchFulfilled,
      (_state, { payload }) => {
        return payload.data;
      }
    );
  },
});

export const { logout, login } = slice.actions;
export const authReducer = slice.reducer;
