import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const errorMessage =
      (action as { payload?: { data?: { message?: string } } }).payload?.data
        ?.message ||
      action.error?.message ||
      "An unknown error occurred";
    // console.log("errorMiddleware", errorMessage);
    toast.error(errorMessage);
  }
  return next(action);
};
