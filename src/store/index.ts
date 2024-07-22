import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./slice/auth";

import { authApi } from "./services/auth";
import { churchApi } from "./services/church";
import { userApi } from "./services/user";
import { myParamApi } from "./services/params";
import { memberApi } from "./services/member";
import { maritalApi } from "./services/marital";
import { baptismApi } from "./services/baptism";
import { childDedicationApi } from "./services/child-dedication";
import { cermonApi } from "./services/cermon";
import { cermonReportApi } from "./services/cermon-report";
import { fellowshipApi } from "./services/fellowship";
import { fellowshipReportApi } from "./services/fellowship-report";
import { disciplesApi } from "./services/disciples";
import { disciplesGroupApi } from "./services/disciples-group";
import { disciplesReportApi } from "./services/disciples-report";

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
    [cermonApi.reducerPath]: cermonApi.reducer,
    [cermonReportApi.reducerPath]: cermonReportApi.reducer,
    [fellowshipApi.reducerPath]: fellowshipApi.reducer,
    [fellowshipReportApi.reducerPath]: fellowshipReportApi.reducer,
    [disciplesApi.reducerPath]: disciplesApi.reducer,
    [disciplesGroupApi.reducerPath]: disciplesGroupApi.reducer,
    [disciplesReportApi.reducerPath]: disciplesReportApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      churchApi.middleware,
      userApi.middleware,
      myParamApi.middleware,
      memberApi.middleware,
      maritalApi.middleware,
      baptismApi.middleware,
      childDedicationApi.middleware,
      cermonApi.middleware,
      cermonReportApi.middleware,
      fellowshipApi.middleware,
      fellowshipReportApi.middleware,
      disciplesApi.middleware,
      disciplesGroupApi.middleware,
      disciplesReportApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
