import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { config } from "../config/app.config";
import { AppError } from "../middleware/error.middleware";
import User from "../models/user.model";
import {
  IGoogleServiceParameter,
  ILoginServiceParameter,
  ILoginServiceReturn,
  ISignupServiceParameter,
  ISignupServiceReturn,
} from "../types/auth.types";
import { generateTokens } from "../utils/token.util";

// Service class for handling authentication-related operations
class AuthService {
  // Registers a new user and returns user data with tokens
  async signupUser(
    userData: ISignupServiceParameter
  ): Promise<ISignupServiceReturn> {
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
      user: {
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

  // Authenticates a user and returns user data with tokens
  async loginUser({
    email_or_username,
    password,
  }: ILoginServiceParameter): Promise<ILoginServiceReturn> {
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

  // Handles Google login or registration
  async google(userData: IGoogleServiceParameter) {
    // 1. Check if a user with the same email already exists
    let user = await User.findOne({ email: userData.email });

    // 2. If user does not exist, create a new user
    if (!user) {
      // Generate a unique username
      let username;
      let usernameExists;
      do {
        username = faker.internet.userName({
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
        usernameExists = await User.findOne({ username });
      } while (usernameExists);

      // Create new user
      user = await User.create({
        ...userData,
        username,
        googleId: userData.uid,
      });

      if (!user) {
        throw AppError.conflictError("Failed to create user");
      }
    }

    // 3. Generate JWT access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // 4. Prepare user response (excluding sensitive fields)
    const {
      _id,
      username,
      profilePicture,
      isVerified,
      firstName,
      lastName,
      email,
    } = user.toObject();

    return {
      user: {
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
  }

  // Logs out the user by clearing the refresh token cookie
  async logout(response: Response): Promise<void> {
    // Clear the 'refreshToken' cookie to log out the user.
    response.clearCookie("refreshToken");
  }
}

// Export a singleton instance of AuthService for use throughout the application.
export default new AuthService();
