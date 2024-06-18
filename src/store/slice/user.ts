import { createSlice } from "@reduxjs/toolkit";
import { GetUserResponse } from "@/interfaces/userResponse";
import { userApi } from "../services/user";

const initialState = {
  isLoading: true,
  payload: {} as GetUserResponse,
  entities: [] as GetUserResponse[],
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      userApi.endpoints.GetUserById.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.payload = payload.data;
      }
    ),
      builder.addMatcher(
        userApi.endpoints.GetAllUser.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.entities = payload?.data.entities;
        }
      );
  },
});

export const userReducer = slice.reducer;
