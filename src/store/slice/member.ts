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
});

export const memberReducer = slice.reducer;
