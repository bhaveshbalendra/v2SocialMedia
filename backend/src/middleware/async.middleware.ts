import { NextFunction, Request, Response } from "express";

// Async Handler middleware - wraps async functions and forwards errors to error middleware
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
