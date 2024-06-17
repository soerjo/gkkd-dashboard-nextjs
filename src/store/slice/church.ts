import { createSlice } from "@reduxjs/toolkit";
import { GetChurchResponse } from "@/interfaces/churchResponse";
import { churchApi } from "../services/church";

const initialState = {
  isLoading: true,
  payload: {} as GetChurchResponse,
  entities: [] as GetChurchResponse[],
};

const slice = createSlice({
  name: "church",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      churchApi.endpoints.GetChurchById.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.payload = payload.data;
      }
    ),
      builder.addMatcher(
        churchApi.endpoints.GetAllChurch.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.entities = payload.data.entities;
        }
      );
  },
});

export const churchReducer = slice.reducer;
