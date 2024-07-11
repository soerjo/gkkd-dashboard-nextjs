import { createSlice } from "@reduxjs/toolkit";
import { MemberDetail, MemberResponse } from "@/interfaces/memberResponse";
import { maritalApi } from "../services/marital";
import { IMarital } from "@/interfaces/marital.interface";

const initialState = {
  isLoading: true,
  payload: {} as IMarital,
  entities: [] as IMarital[],
  meta: {} as any,
};

const slice = createSlice({
  name: "marital",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      maritalApi.endpoints.GetMaritalById.matchPending,
      state => {
        state.isLoading = true;
        // state.payload = payload.data;
      }
    ),
      builder.addMatcher(
        maritalApi.endpoints.GetMaritalById.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.payload = payload.data;
          return state;
          // state.payload = payload.data;
        }
      );
  },
});

export const maritalReducer = slice.reducer;
