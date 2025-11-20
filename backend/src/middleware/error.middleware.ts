import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { config } from "../config/app.config";

// Custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  path?: string;
  code?: string;
  value?: string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, unknown>;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  // Create an authentication error instance
  static authError(message = "Authentication required"): AppError {
    return new AppError(message, 401);
  }

  // Create an unauthorized error instance (403 Forbidden)
  static unauthorizedError(
    message = "Not authorized to perform this action"
  ): AppError {
    return new AppError(message, 403);
  }

  // Create a validation error instance
  static validationError(
    message: string,
    errors: Record<string, unknown>
  ): AppError {
    const error = new AppError(message, 400);
    error.errors = errors;
    return error;
  }

  // Create a not found error instance
  static notFoundError(entity = "Resource"): AppError {
    return new AppError(`${entity} not found`, 404);
  }

  // Create 400 Invalid data or empty error instance
  static emptyOrInvalidData(message = "Data Invalid or Empty"): AppError {
    return new AppError(message, 400);
  }

  // Create invalid credentials error instance
  static invalidCredentialsError(): AppError {
    return new AppError("Invalid credentials", 401);
  }

  // Create conflict error instance
  static conflictError(message: string): AppError {
    return new AppError(message, 409);
  }

  // Create rate limit error instance
  static tooManyRequestsError(message: string): AppError {
    return new AppError(message, 429);
  }
}

// Express error-handling middleware - handles different error types and sends appropriate responses
export const handleError = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Set default values for statusCode and message
  // If the error object does not have a statusCode or message, set them to default values
  const errorObj = error as {
    statusCode?: number;
    message?: string;
    name?: string;
    code?: number | string;
    keyValue?: Record<string, unknown>;
    path?: string;
    value?: unknown;
    errors?: Record<string, { message?: string }>;
    stack?: string;
  };
  const statusCode = errorObj.statusCode || 500;
  const message = errorObj.message || "Internal Server Error";

  // Initialize node_env from config or set to default value
  const node_env = config.node_env || "development";

  // Log the error in development mode for debugging
  if (node_env === "development") {
    console.error("Error:", error);
  }

  // Handle Mongoose validation errors
  if (errorObj.name === "ValidationError") {
    const validationErrors: Record<string, string> = {};

    Object.keys(errorObj.errors || {}).forEach((key) => {
      validationErrors[key] =
        errorObj.errors?.[key]?.message || "Unknown validation error";
    });

    response.status(400).json({
      success: false,
      message: "Validation Error",
      errors: validationErrors,
    });
    return;
  }

  // Handle MongoDB duplicate key errors (e.g., unique index violation)
  if (Number(errorObj.code) === 11000) {
    const field = Object.keys(errorObj.keyValue || {})[0];
    response.status(409).json({
      success: false,
      message: `${
        field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"
      } already exists`,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  if (errorObj.name === "CastError") {
    response.status(400).json({
      success: false,
      message: `Invalid ${errorObj.path || "field"}: ${errorObj.value}`,
    });
    return;
  }

  // Check if the error is an instance of MulterError (file upload errors)
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      // Use 413 Payload Too Large for file size errors
      response.status(413).json({
        success: false,
        message: "File Size exceed please upload media of size less than 2MB",
      });
    } else if (error.code === "LIMIT_FIELD_COUNT") {
      response.status(400).json({
        success: false,
        message: "Only allowed to upload media up to 5 files only.",
      });
    } else {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return;
  }

  // Check if the error is an instance of AppError (custom application errors)
  if (error instanceof AppError) {
    const responseData: {
      success: boolean;
      message: string;
      errors?: Record<string, unknown>;
    } = {
      success: false,
      message: message,
    };

    // Include additional validation errors if present
    if (error.errors) {
      responseData.errors = error.errors;
    }

    // Respond with the error details
    response.status(statusCode).json(responseData);

    // Return to prevent further processing
    return;
  }

  // For programming or unknown errors, don't leak details in production
  response.status(statusCode).json({
    success: false,
    message: node_env === "development" ? message : "Something went wrong",
    ...(node_env === "development" && errorObj.stack
      ? { stack: errorObj.stack }
      : {}),
  });

  // Return to prevent further processing
  // This is important to prevent the server from continuing to process the request after an error has occurred
  return;
};
