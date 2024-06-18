import { configureStore } from "@reduxjs/toolkit";

import { counterReducer } from "./slice/count";
import { authReducer } from "./slice/auth";
import { churchReducer } from "./slice/church";
import { userReducer } from "./slice/user";
import { memberReducer } from "./slice/member";

import { authApi } from "./services/auth";
import { churchApi } from "./services/church";
import { userApi } from "./services/user";
import { myParamApi } from "./services/params";
import { memberApi } from "./services/member";
import { pokemonApi } from "./services/pokemon";

export const makeStore = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    church: churchReducer,
    user: userReducer,
    member: memberReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [churchApi.reducerPath]: churchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [myParamApi.reducerPath]: myParamApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([
      pokemonApi.middleware,
      authApi.middleware,
      churchApi.middleware,
      userApi.middleware,
      myParamApi.middleware,
      memberApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
