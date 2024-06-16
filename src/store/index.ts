import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slice/count";
import { pokemonApi } from "./services/pokemon";
import { authReducer } from "./slice/auth";
import { authApi } from "./services/auth";
import { themeReducer } from "./slice/theme";

export const makeStore = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    theme: themeReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      pokemonApi.middleware,
      authApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
