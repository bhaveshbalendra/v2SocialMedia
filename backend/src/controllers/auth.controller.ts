import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { config } from "../config/app.config";
import authService from "../services/auth.service";

/**
 * @description Handles user signup by calling the authService to create a new user.
 * @param {Request} request - The request object containing user data.
 * @param {Response} response - The response object to send the result.
 * @returns {Promise<any>} - A promise that resolves to the response object.
 * @throws {AppError} - Throws an app error if user creation fails.
 */
const handleSignupUser = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    //Authenticate the user using the authService
    const {
      userResponse: user,
      accessToken,
      refreshToken,
    } = await authService.signupUser(request.body);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      maxAge: Number(config.jwt.refreshTokenExpiry) * 1000, //in milliseconds
    });
    response.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      accessToken,
    });

    return;
  }
);

const handleLoginUser = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { email_or_username, password } = request.body;

    //Authenticating user using authService
    const { user, accessToken, refreshToken } = await authService.loginUser(
      email_or_username,
      password
    );

    //Set the refresh token in the cookie
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      maxAge: Number(config.jwt.refreshTokenExpiry),
    });

    response.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      accessToken,
    });
  }
);

const handleAuthUserRoutes = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const user = request.user;
    const accessToken = request.accessToken;

    response.status(200).json({
      message: "Authenticate user",
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
      },
      accessToken,
    });
    return;
  }
);

export { handleAuthUserRoutes, handleLoginUser, handleSignupUser };
