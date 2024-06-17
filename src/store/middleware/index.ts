import { Middleware, MiddlewareAPI, isRejected } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    // isRejectedWithValue Or isRejected
    if (isRejected(action)) {
      console.log(action); // get all data from rejected request
      if (action.error?.code) {
        console.log(action.error?.message);
      }
    }

    return next(action);
  };
