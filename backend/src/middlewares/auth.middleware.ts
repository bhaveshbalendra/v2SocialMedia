import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import {
  extractTokenFromHeader,
  generateAccessToken,
  verifyToken,
} from "../utils/token";
import { AppError } from "./error.middleware";

/**
 * @description Authenticate middleware for user check if access token is expired first
 * and then check if the cookie which is refreshToken containing userid is present in database is valid or not
 * if no throw error
 * if yes then it check for access token in header if expired it create new one and send it
 * to header and add user id in response object and call next().
 */
export const authenticate = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    //Get the token from the cookie
    const refreshToken = request.cookies.refreshToken || "";

    // Get the token from the Authorization header
    const accessToken = extractTokenFromHeader(request.headers.authorization);

    //check for refresh token
    if (!refreshToken) {
      throw AppError.authError("Please Login");
    }

    //use verifyToken function for verifying token
    const { payload: decodedRefreshToken, expired: expiredRefreshToken } =
      verifyToken(refreshToken || "");

    //throw error if its false
    if (expiredRefreshToken) {
      throw AppError.authError("Session expired or Invalid");
    }

    //check user in data base
    const user = await User.findById(decodedRefreshToken?.userId).select(
      "-password"
    );

    //throw error if user is not present on database
    if (!user) {
      throw AppError.authError("Invalid User");
    }

    //check for accessToken
    if (!accessToken) {
      throw AppError.authError("Please Login");
    }

    //Pass token and check if expired
    const { payload: decodedAccessToken, expired: expiredAccessToken } =
      verifyToken(accessToken || "");

    //Check if expired throw error
    if (expiredAccessToken) {
      const newAccessToken = generateAccessToken(user?._id);
      request.accessToken = newAccessToken;
    } else {
      request.accessToken = accessToken;
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

    //call next
    next();
    return;
  }
);
