// Auth routes: signup, login, get current user, and logout
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

// Register a new user account
router.post(
  "/signup",
  authLimiter,
  validateRequest(userValidation.signup),
  handleSignupUser as RequestHandler
);

// Authenticate user and return tokens
router.post(
  "/login",
  authLimiter,
  validateRequest(userValidation.login),
  handleLoginUser as RequestHandler
);

// Get authenticated user's information
router.get("/me", authenticate, handleAuthUserRoutes as RequestHandler);

// Logout user and clear authentication cookies
router.post("/logout", authenticate, handleLogout as RequestHandler);

// Google OAuth login
router.post("/google", handleGoogleLogin);

export default router;
