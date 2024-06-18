import { createSlice } from "@reduxjs/toolkit";
import { MemberResponse } from "@/interfaces/memberResponse";
import { memberApi } from "../services/member";

const initialState = {
  isLoading: true,
  payload: {} as MemberResponse,
  entities: [] as MemberResponse[],
  meta: {} as any,
};

const slice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      memberApi.endpoints.GetMemberById.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.payload = payload.data;
      }
    ),
      builder.addMatcher(
        memberApi.endpoints.GetAllMember.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.entities = payload.data.entities;
          state.meta = payload.data.meta;
        }
      );
  },
});

export const memberReducer = slice.reducer;
