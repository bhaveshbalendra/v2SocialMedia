import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { config } from "../config/app.config";
import authService from "../services/auth.service";

/**
 *  @description Handles user signup by calling the authService to create a new user.
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
      maxAge: Number(config.jwt.refreshTokenExpiry),
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

const handleLoginUser = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { email, password } = request.body;
  //Authenticating user using authService
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
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
};

export { handleLoginUser, handleSignupUser };
