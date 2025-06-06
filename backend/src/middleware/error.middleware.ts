import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { config } from "../config/app.config";

/**
 * Custom error class for application-specific errors.
 * This class extends the built-in Error class and adds additional properties
 * @class AppError
 * @extends Error
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  path?: string;
  code?: string;
  value?: string;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create an authentication error instance
   * @param message Error message
   * @returns AppError instance
   */
  static authError(message = "Authentication required"): AppError {
    return new AppError(message, 401);
  }

  /**
   * Create an unauthorized error instance (403 Forbidden)
   * @param message Error message
   * @returns AppError instance
   */
  static unauthorizedError(
    message = "Not authorized to perform this action"
  ): AppError {
    return new AppError(message, 403);
  }

  /**
   * Creating a validation error instance
   * @param {string} message - Error message
   * @param {Record<string, any>} errors - Validation errors object
   * @returns {AppError} - Instance of AppError with validation errors
   */
  static validationError(
    message: string,
    errors: Record<string, any>
  ): AppError {
    const error = new AppError(message, 400);
    error.errors = errors;
    return error;
  }

  /**
   * Creating a not found error instance
   * @param {string} entity - The name of the entity that was not found
   * @returns {AppError} - Instance of AppError with not found error
   */
  static notFoundError(entity = "Resource"): AppError {
    return new AppError(`${entity} not found`, 404);
  }

  /**
   * Creating 400 Invalid data or empty error instance
   * @returns {AppError}
   */
  static emptyOrInvalidData(message = "Data Invalid or Empty"): AppError {
    return new AppError(message, 400);
  }

  /**
   * Invalid credentials error instance
   * @returns {AppError}
   */
  static invalidCredentialsError(): AppError {
    return new AppError("Invalid credentials", 401);
  }

  /**
   * Conflict error instance
   * @param message Error message
   * @returns AppError instance with conflict status code
   */
  static conflictError(message: string): AppError {
    return new AppError(message, 409);
  }

  /**
   * rate limit error
   *@param message Error message
   *@returns AppError instance with error code
   */
  static tooManyRequestsError(message: string): AppError {
    return new AppError(message, 429);
  }
}

/**
 * Express error-handling middleware.
 * Handles different error types and sends appropriate responses to the client.
 * It captures the error, logs it in development mode, and sends a JSON response.
 * @param error Error object
 * @param request Express request object
 * @param response Express response object
 * @param next Express next function
 * @returns {void}
 */
export const handleError = (
  error: any, // Accept any error object for broad compatibility
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Set default values for statusCode and message
  // If the error object does not have a statusCode or message, set them to default values
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Initialize node_env from config or set to default value
  const node_env = config.node_env || "development";

  // Log the error in development mode for debugging
  if (node_env === "development") {
    console.error("Error:", error);
  }

  // Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    const validationErrors: Record<string, string> = {};

    Object.keys(error.errors || {}).forEach((key) => {
      validationErrors[key] =
        error.errors?.[key]?.message || "Unknown validation error";
    });

    response.status(400).json({
      success: false,
      message: "Validation Error",
      errors: validationErrors,
    });
    return;
  }

  //   Error: Error: User validation failed: password: Password must be at most 20 character long
  //     at ValidationError.inspect (D:\projects\v2SocialMedia\backend\node_modules\mongoose\lib\error\validation.js:52:26)
  //     at formatValue (node:internal/util/inspect:850:19)
  //     at inspect (node:internal/util/inspect:387:10)
  //     at formatWithOptionsInternal (node:internal/util/inspect:2366:40)
  //     at formatWithOptions (node:internal/util/inspect:2228:10)
  //     at console.value (node:internal/console/constructor:345:14)
  //     at console.error (node:internal/console/constructor:412:61)
  //     at handleError (D:\projects\v2SocialMedia\backend\src\middlewares\error.middleware.ts:72:13)
  //     at Layer.handleError (D:\projects\v2SocialMedia\backend\node_modules\router\lib\layer.js:116:17)
  //     at trimPrefix (D:\projects\v2SocialMedia\backend\node_modules\router\index.js:340:13) {
  //   errors: {
  //     password: ValidatorError: Password must be at most 20 character long
  //         at validate (D:\projects\v2SocialMedia\backend\node_modules\mongoose\lib\schemaType.js:1404:13)
  //         at SchemaString.SchemaType.doValidate (D:\projects\v2SocialMedia\backend\node_modules\mongoose\lib\schemaType.js:1388:7)
  //         at D:\projects\v2SocialMedia\backend\node_modules\mongoose\lib\document.js:3104:18
  //         at processTicksAndRejections (node:internal/process/task_queues:85:11) {
  //       properties: [Object],
  //       kind: 'maxlength',
  //       path: 'password',
  //       value: '$2b$10$gty/uF.qlKT2jqVyqb9zBOYHEIYS6fUMroevWEWhjA/QrnvJRHmMK',
  //       reason: undefined,
  //       [Symbol(mongoose#validatorError)]: true
  //     }
  //   },
  //   _message: 'User validation failed'
  // }

  // Handle MongoDB duplicate key errors (e.g., unique index violation)
  if (Number(error.code) === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    response.status(409).json({
      success: false,
      message: `${
        field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"
      } already exists`,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  if (error.name === "CastError") {
    response.status(400).json({
      success: false,
      message: `Invalid ${error.path || "field"}: ${error.value}`,
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
    const responseData: any = {
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
    ...(node_env === "development" && error.stack
      ? { stack: error.stack }
      : {}),
  });

  // Return to prevent further processing
  // This is important to prevent the server from continuing to process the request after an error has occurred
  return;
};
