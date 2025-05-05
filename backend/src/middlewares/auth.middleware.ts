import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { extractTokenFromHeader, verifyToken } from "../utils/token";
import { AppError } from "./error.middleware";

export const authenticate = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    // Get the token from the Authorization header

    const accessToken = extractTokenFromHeader(request.headers.authorization);

    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw AppError.authError("Invalid user");
    }

    const { payload: decodedRefreshToken, expired: expiredRefreshToken } =
      verifyToken(refreshToken || "");

    if (expiredRefreshToken) {
      throw AppError.authError("Session expired or Invalid");
    }

    console.log(decodedRefreshToken);
    const refreshUser = await User.findById(decodedRefreshToken?.userId).select(
      "-password"
    );

    if (!accessToken) {
      throw AppError.authError("Invalid User");
    }

    //Pass token and check if expired
    const { payload: decode, expired } = verifyToken(accessToken || "");

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
