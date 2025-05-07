/**
 * Auth Router
 * -----------
 * Handles user authentication routes: signup and login.
 * Applies validation middleware to ensure correct request payloads.
 */

import { RequestHandler, Router } from "express";
import {
  handleLoginUser,
  handleSignupUser,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validator.middleware";
import { userValidation } from "../utils/validators";

// Initialize Express Router instance for authentication routes
const router = Router();

/**
 * @route   POST /signup
 * @desc    Register a new user account
 * @access  Public
 * @middlewares
 *   - validateRequest: Validates request body against signup schema
 * @controller
 *   - handleSignupUser: Handles user registration logic
 */
router.post(
  "/signup",
  validateRequest(userValidation.signup),
  handleSignupUser as RequestHandler
);

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 * @controller
 *   - handleLoginUser: Handles user login logic
 */
router.post("/login", handleLoginUser as RequestHandler);

export default router;
