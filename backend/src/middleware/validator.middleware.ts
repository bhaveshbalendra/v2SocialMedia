import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { AppError } from "./error.middleware";

export const validateRequest = (
  schema: ObjectSchema,
  type: "body" | "params" | "query" = "body"
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request[type], {
      abortEarly: false,
      stripUnknown: true,
    });


    if (!error) {
      next();
      return;
    }

    const errorDetails = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));

    // Create formatted error message
    const formattedMessage = errorDetails
      .map((err) => `${err.message}`)
      .join(", ");

    // Format validation errors as an object
    const validationErrors: Record<string, string> = {};
    error.details.forEach((err) => {
      const key = err.path.join(".");
      validationErrors[key] = err.message;
    });

    // Pass to error handler middleware using the factory method
    next(AppError.validationError(formattedMessage, validationErrors));
  };
};
