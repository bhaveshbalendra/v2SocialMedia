import bcrypt from "bcryptjs";
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
   * @param userData -User data for signup
   * @returns { userResponse: User,accessToken,RefreshToken } - Created user object without password
   */
  async signupUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({
      $or: [
        {
          email: userData.email,
        },
        { username: userData.username },
      ],
    });

    //If the user is already exists, throw a conflict error
    if (existingUser) {
      throw AppError.conflictError(
        existingUser.email === userData.email
          ? "Email already exists"
          : "Username already exists"
      );
    }

    //Use bcryptjs to hash the password
    //The genSalt function generates a salt with the specified number of rounds (10 in this case)
    const saltRounds = Number(config.bcrypt.saltRounds) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    //Create a new user in the database using the User model
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    //If the user creation fails, throw a conflict error
    if (!newUser) {
      throw AppError.conflictError("Failed to create user");
    }

    //Generate access and refresh tokens for the new user
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    //Remove the password field from the user object before sending the response
    //toObject() converts the Mongoose document to a plain JavaScript object
    const {
      _id,
      username,
      profilePicture,
      isVerified,
      firstName,
      lastName,
      email,
    } = newUser.toObject();

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

    // newUser
    //   {
    //     "success": true,
    //     "message": "User registered successfully",
    //     "user": {
    //         "username": "",
    //         "email": "",
    //         "firstName": "",
    //         "lastName": "",
    //         "profilePicture": "",
    //         "location": {
    //             "type": "Point"
    //         },
    //         "isVerified": false,
    //         "isPrivate": false,
    //         "isPremium": false,
    //         "isBlocked": false,
    //         "isDeleted": false,
    //         "isEmailVerified": false,
    //         "isMobileVerified": false,
    //         "isAdmin": false,
    //         "isSuperAdmin": false,
    //         "_id": "",
    //         "createdAt": "",
    //         "updatedAt": "",
    //         "__v": 0
    //     },
    //     "accessToken": ""
    // }
  }

  /**
   * Login a user
   * @param email - User's email
   * @param password - User's password
   * @returns {Promise<object>} User object and token
   */
  async loginUser(email_or_username: string, password: string) {
    //Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
    }).select("+password");

    //check if user exists
    if (!user) {
      throw AppError.notFoundError("User");
    }

    //Check if the password is correct using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //If the password is incorrect, throw a invalid credentials error
    if (!isPasswordValid) {
      throw AppError.invalidCredentialsError();
    }

    //Generate access and refresh tokens for the new user
    const { accessToken, refreshToken } = generateTokens(user._id);

    //Remove the password field from the user object before sending the response
    //toObject() converts the Mongoose document to a plain JavaScript object
    const {
      _id,
      firstName,
      lastName,
      username,
      email,
      profilePicture,
      isVerified,
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
}
export default new AuthService();
