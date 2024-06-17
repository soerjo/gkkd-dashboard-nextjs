import { configureStore } from "@reduxjs/toolkit";

import { counterReducer } from "./slice/count";
import { authReducer } from "./slice/auth";
import { churchReducer } from "./slice/church";

import { authApi } from "./services/auth";
import { churchApi } from "./services/church";
import { pokemonApi } from "./services/pokemon";

export const makeStore = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    church: churchReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [churchApi.reducerPath]: churchApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([
      pokemonApi.middleware,
      authApi.middleware,
      churchApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
