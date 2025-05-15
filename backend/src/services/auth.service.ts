import bcrypt from "bcryptjs";
import { Response } from "express";
import { config } from "../config/app.config";
import { AppError } from "../middlewares/error.middleware";
import User from "../models/user.model";
import { generateTokens } from "../utils/token";

/**
 * @class AuthService
 * @description Service class for handling authentication-related operations.
 */
class AuthService {
  /**
   * Registers a new user.
   * @param userData - User data for signup.
   * @returns { userResponse: User, accessToken, refreshToken } - Created user object (without password) and tokens.
   * @throws {AppError} - Throws an error if user already exists or creation fails.
   */
  async signupUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{
    userResponse: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      profilePicture: string | undefined;
      isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if a user with the same email or username already exists in the database.
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    // If a user is found, throw a conflict error indicating which field is duplicated.
    if (existingUser) {
      throw AppError.conflictError(
        existingUser.email === userData.email
          ? "Email already exists"
          : "Username already exists"
      );
    }

    // Generate a salt using bcryptjs with the configured number of rounds (default: 10).
    const saltRounds = Number(config.bcrypt.saltRounds) || 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the user's password using the generated salt.
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create a new user document in the database with the hashed password.
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // If user creation fails, throw a conflict error.
    if (!newUser) {
      throw AppError.conflictError("Failed to create user");
    }

    // Generate JWT access and refresh tokens for the newly created user.
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Destructure required fields from the user object, excluding the password.
    // toObject() converts the Mongoose document to a plain JavaScript object.
    const {
      _id,
      username,
      profilePicture,
      isVerified,
      firstName,
      lastName,
      email,
    } = newUser.toObject();

    // Return the user data (without password) and the generated tokens.
    return {
      userResponse: {
        _id,
        firstName,
        lastName,
        username,
        email,
        profilePicture,
        isVerified,
      },
      accessToken,
      refreshToken,
    };

    // Example structure of the returned user object:
    // {
    //   "success": true,
    //   "message": "User registered successfully",
    //   "user": {
    //     "username": "",
    //     "email": "",
    //     "firstName": "",
    //     "lastName": "",
    //     "profilePicture": "",
    //     "location": { "type": "Point" },
    //     "isVerified": false,
    //     "isPrivate": false,
    //     "isPremium": false,
    //     "isBlocked": false,
    //     "isDeleted": false,
    //     "isEmailVerified": false,
    //     "isMobileVerified": false,
    //     "isAdmin": false,
    //     "isSuperAdmin": false,
    //     "_id": "",
    //     "createdAt": "",
    //     "updatedAt": "",
    //     "__v": 0
    //   },
    //   "accessToken": ""
    // }
  }

  /**
   * Authenticates a user and issues tokens.
   * @param email_or_username - User's email or username.
   * @param password - User's password.
   * @returns {Promise<object>} - User object (without password) and tokens.
   * @throws {AppError} - Throws an error if user is not found or credentials are invalid.
   */
  async loginUser(
    email_or_username: string,
    password: string
  ): Promise<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      profilePicture: string;
      isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // Find the user by email or username, including the password field for verification.
    const user = await User.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
    }).select("+password");

    // If user does not exist, throw a not found error.
    if (!user) {
      throw AppError.notFoundError("User");
    }

    // Compare the provided password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, throw an invalid credentials error.
    if (!isPasswordValid) {
      throw AppError.invalidCredentialsError();
    }

    // Generate JWT access and refresh tokens for the authenticated user.
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Destructure required fields from the user object, excluding the password.
    // toObject() converts the Mongoose document to a plain JavaScript object.
    const {
      _id,
      firstName,
      lastName,
      username,
      email,
      profilePicture,
      isVerified,
    } = user.toObject();

    // Return the user data (without password) and the generated tokens.
    return {
      user: {
        _id,
        firstName,
        lastName,
        username,
        email,
        profilePicture: profilePicture || "",
        isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs out the user by clearing the refresh token cookie.
   * @param response - Express response object.
   */
  async logout(response: Response): Promise<void> {
    // Clear the 'refreshToken' cookie to log out the user.
    response.clearCookie("refreshToken");
  }
}

// Export a singleton instance of AuthService for use throughout the application.
export default new AuthService();
