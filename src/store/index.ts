import { configureStore } from "@reduxjs/toolkit";

import { counterReducer } from "./slice/count";
import { authReducer } from "./slice/auth";
import { churchReducer } from "./slice/church";
import { userReducer } from "./slice/user";
import { memberReducer } from "./slice/member";
import { maritalReducer } from "./slice/marital";

import { authApi } from "./services/auth";
import { churchApi } from "./services/church";
import { userApi } from "./services/user";
import { myParamApi } from "./services/params";
import { memberApi } from "./services/member";
import { maritalApi } from "./services/marital";
import { baptismApi } from "./services/baptism";
import { childDedicationApi } from "./services/child-dedication";

export const makeStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [churchApi.reducerPath]: churchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [myParamApi.reducerPath]: myParamApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [maritalApi.reducerPath]: maritalApi.reducer,
    [baptismApi.reducerPath]: baptismApi.reducer,
    [childDedicationApi.reducerPath]: childDedicationApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      churchApi.middleware,
      userApi.middleware,
      myParamApi.middleware,
      memberApi.middleware,
      maritalApi.middleware,
      baptismApi.middleware,
      childDedicationApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
