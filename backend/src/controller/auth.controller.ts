import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { config } from "../config/app.config";
import authService from "../service/auth.service";

// Handle user signup
const handleSignupUser = asyncHandler(
  async (request: Request, response: Response) => {
    const userData = request.body;
    // Call the signupUser method from authService with data from the request body
    const {
      user: user, // The created user object (renamed for clarity)
      accessToken, // JWT access token for authentication
      refreshToken, // JWT refresh token for session management
    } = await authService.signupUser(userData);

    // Store the refresh token in an HTTP-only cookie for security
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access to the cookie (mitigates XSS)
      secure: true, // Required for SameSite=None (cross-site cookies)
      sameSite: "none", // Allow cross-site cookie usage
      maxAge: Number(config.jwt.refreshTokenExpiry) * 1000, // Set cookie expiry (milliseconds)
    });

    // Send back a successful response with user data and tokens
    response.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      accessToken,
    });
  }
);

// Handle user login
const handleLoginUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Extract credentials from request body
    const { email_or_username, password } = request.body;

    // Authenticate user using authService and get tokens
    const { user, accessToken, refreshToken } = await authService.loginUser({
      email_or_username,
      password,
    });

    // Store the refresh token in an HTTP-only cookie
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Required for SameSite=None (cross-site cookies)
      sameSite: "none", // Allow cross-site cookie usage
      maxAge: Number(config.jwt.refreshTokenExpiry) * 1000, // Note: should be *1000 for ms if config is in seconds
    });

    // Respond with user info and access token
    response.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      accessToken,
    });
    return;
  }
);

// Get authenticated user's information
const handleAuthUserRoutes = asyncHandler(
  async (request: Request, response: Response) => {
    // Retrieve user and accessToken from request (assumed to be set by authentication middleware)
    const user = request.user;
    const accessToken = request.accessToken;

    // Respond with user details and access token
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

// Handle user logout
const handleLogout = asyncHandler(
  async (request: Request, response: Response) => {
    // Call the logout method in authService to clear the refresh token cookie
    await authService.logout(response);
    // Respond with a success message
    response.status(200).json({
      message: "User Logout successfully",
      success: true,
    });
  }
);

// Handle Google OAuth login
const handleGoogleLogin = asyncHandler(
  async (request: Request, response: Response) => {
    const { firstName, lastName, uid, email } = request.body;
    const { user, accessToken, refreshToken } = await authService.google({
      firstName,
      lastName,
      uid,
      email,
    });

    // Store the refresh token in an HTTP-only cookie
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Required for SameSite=None (cross-site cookies)
      sameSite: "none", // Allow cross-site cookie usage
      maxAge: Number(config.jwt.refreshTokenExpiry) * 1000, // Note: should be *1000 for ms if config is in seconds
    });

    // Respond with user info and access token
    response.status(200).json({
      success: true,
      message: "User Google logged in successfully",
      user,
      accessToken,
    });
    return;
  }
);

// Export the handlers for use in route definitions
export {
  handleAuthUserRoutes,
  handleGoogleLogin,
  handleLoginUser,
  handleLogout,
  handleSignupUser,
};
