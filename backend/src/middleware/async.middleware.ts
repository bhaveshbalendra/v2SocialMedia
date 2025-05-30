import { NextFunction, Request, Response } from "express";

/**
 * Async Handler middleware
 * Wraps async functions in a try-catch block and forwards errors to the error middleware
 * @param fn Async function to wrap
 * @returns Express middleware function with error handling
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
