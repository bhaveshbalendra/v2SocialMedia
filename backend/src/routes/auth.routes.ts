/**
 * Auth Router
 * -----------
 * Handles user authentication routes: signup, login, get current user, and logout.
 * Applies validation and authentication middleware to ensure secure and valid requests.
 */

import { RequestHandler, Router } from "express";
import {
  handleAuthUserRoutes,
  handleGoogleLogin,
  handleLoginUser,
  handleLogout,
  handleSignupUser,
} from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validator.middleware";
import { createRateLimiter } from "../utils/rateLimiter.util";
import { userValidation } from "../utils/validators.util";

// Initialize Express Router instance for authentication routes
const router = Router();

// Example: 5 requests per minute for login/signup
const authLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5 });

//----------------------------------------------------------------------------------------//

/**
 * @route       POST /api/v2/auth/signup
 * @description Register a new user account and return set refresh token as cookie and send access token.
 * @access      Public
 * @middlewares
 *   - validateRequest: Validates request body against signup schema.
 *   - authLimiter: Limits the number of requests to 5 per minute.
 * @controller
 *   - handleSignupUser: Handles user registration logic.
 */
router.post(
  "/signup",
  authLimiter,
  validateRequest(userValidation.signup),
  handleSignupUser as RequestHandler
);

/**
 * @route       POST /api/v2/auth/login
 * @description Authenticate user and return set refresh token as cookie and send access token.
 * @access      Public
 * @middlewares
 *   - validateRequest: Validates request body against login schema.
 *   - authLimiter: Limits the number of requests to 5 per minute.
 * @controller
 *   - handleLoginUser: Handles user login logic.
 */
router.post(
  "/login",
  authLimiter,
  validateRequest(userValidation.login),
  handleLoginUser as RequestHandler
);

/**
 * @route       GET /api/v2/auth/me
 * @description Get the authenticated user's information.
 * @access      Private
 * @middlewares
 *   - authenticate: Checks access token and user authentication.
 * @controller
 *   - handleAuthUserRoutes: Returns authenticated user info.
 */
router.get("/me", authenticate, handleAuthUserRoutes as RequestHandler);

/**
 * @route       POST /api/v2/auth/logout
 * @description Logout user and clear authentication cookies (refresh token).
 * @access      Private
 * @middlewares
 *   - authenticate: Checks access token and user authentication.
 * @controller
 *   - handleLogout: Handles user logout logic.
 */
router.post("/logout", authenticate, handleLogout as RequestHandler);

/**
 * @route POST /api/v2/auth/google
 * @description Google login
 * @access Public
 * @controller
 *   - handleGoogleLogin: Handles Google login logic.
 */
router.post("/google", handleGoogleLogin);

/**
 * @route   POST /api/v2/auth/send-otp
 * @desc    Send OTP to mobile number
 * @access  Public
 */
// router.post(
//   "/send-otp",
//   authRateLimiter,
//   validateRequest(userValidation.mobileNumber),
//   sendOTP
// );

/**
 * @route   POST /api/v2/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 */
// router.post(
//   "/verify-otp",
//   authRateLimiter,
//   validateRequest(userValidation.verifyOTP),
//   verifyOTP
// );

/**
 * @route   GET /api/v2/auth/verify-email/:token
 * @desc    Verify email
 * @access  Public
 */
// router.get("/verify-email/:token", verifyEmail);

/**
 * @route   POST /api/v2/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
// router.post(
//   "/forgot-password",
//   authRateLimiter,
//   validateRequest(userValidation.email),
//   forgotPassword
// );

/**
 * @route   POST /api/v2/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
// router.post(
//   "/reset-password/:token",
//   authRateLimiter,
//   validateRequest(userValidation.resetPassword),
//   resetPassword
// );

/**
 * @route   PUT /api/v2/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
// router.put(
//   "/change-password",
//   authenticate,
//   validateRequest(userValidation.updatePassword),
//   changePassword
// );

export default router;
