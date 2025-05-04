import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { extractTokenFromHeader, verifyToken } from "../utils/token";
import { AppError } from "./error.middleware";

export const authenticate = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    // Get the token from the Authorization header

    const token = extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw AppError.authError("Invalid User");
    }

    //Pass token and check if expired
    const { payload: decode, expired } = verifyToken(token || "");

    //Check if expired throw error
    if (expired) {
      throw AppError.authError("Session expired or Invalid");
    }

    //find the user in token
    const user = await User.findById(decode?.userId).select("-password");

    //throw error if user is not present on database
    if (!user) {
      throw AppError.authError("Invalid User");
    }

    //check if user is blocked or deleted
    if (user.isBlocked || user.isDeleted) {
      const message = user.isBlocked
        ? "Account is blocked"
        : "Account is deleted";
      throw AppError.authError(message);
    }

    //Add user to request object
    request.user = user;
    next();
    return;
  }
);
