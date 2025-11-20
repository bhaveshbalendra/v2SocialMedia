// rateLimitMiddleware.ts
import rateLimit from "express-rate-limit";
import { AppError } from "../middleware/error.middleware";

// Interface for rate limiter options
export interface IRateLimiter {
  windowMs?: number;
  max?: number;
  message?: string;
}

// Creates a rate limiter middleware that passes errors to the global error handler
// Can be added in routes like login and signup
export function createRateLimiter(options: IRateLimiter) {
  return rateLimit({
    windowMs: options.windowMs || 60 * 1000, // 1 minute default
    max: options.max || 100, // Default 100 requests per window
    handler: (req, res, next) => {
      // Pass a custom 429 error to your error middleware
      next(
        AppError.tooManyRequestsError(
          options.message || "Too many requests, please try again later."
        )
      );
    },
    // Optionally, you can disable the default message
    // message: undefined,
  });
}
