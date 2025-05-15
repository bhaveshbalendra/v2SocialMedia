/**
 * Auth Router
 * -----------
 * Handles user authentication routes: signup, login, get current user, and logout.
 * Applies validation and authentication middleware to ensure secure and valid requests.
 */

import { RequestHandler, Router } from "express";
import {
  handleAuthUserRoutes,
  handleLoginUser,
  handleLogout,
  handleSignupUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validator.middleware";
import { createRateLimiter } from "../utils/rateLimiter";
import { userValidation } from "../utils/validators";

// Initialize Express Router instance for authentication routes
const router = Router();

// Example: 5 requests per minute for login/signup
const authLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5 });

//----------------------------------------------------------------------------------------//

/**
 * @route       POST /api/v2/auth/signup
 * @description Register a new user account.
 * @access      Public
 * @middlewares
 *   - validateRequest: Validates request body against signup schema.
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
 * @description Authenticate user and return token.
 * @access      Public
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
 *
 */
router.post("");

export default router;
