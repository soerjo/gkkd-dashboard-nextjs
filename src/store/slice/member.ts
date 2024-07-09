import { createSlice } from "@reduxjs/toolkit";
import { MemberDetail, MemberResponse } from "@/interfaces/memberResponse";
import { memberApi } from "../services/member";

const initialState = {
  isLoading: true,
  payload: {} as MemberDetail,
  entities: [] as MemberResponse[],
  meta: {} as any,
};

const slice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      memberApi.endpoints.GetMemberById.matchPending,
      state => {
        state.isLoading = true;
        // state.payload = payload.data;
      }
    ),
      builder.addMatcher(
        memberApi.endpoints.GetMemberById.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.payload = payload.data;
          return state;
          // state.payload = payload.data;
        }
      );
  },
});

export const memberReducer = slice.reducer;
