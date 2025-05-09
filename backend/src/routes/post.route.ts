import express, { RequestHandler, Router } from "express";
import {
  handleCreatePost,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
} from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadMultiple } from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validator.middleware";
import { postValidator } from "../utils/validators";

// Initialize Express Router instance for post-related routes
const router: Router = Router();

/**
 * @route   POST /create-post
 * @desc    Create a new post (with up to 5 media files)
 * @access  Private (requires authentication)
 * @middlewares
 *   - authenticate: Ensures the user is logged in
 *   - uploadMultiple: Handles file uploads for the 'media' field (max 5 files)
 *   - validateRequest: Validates request body against post creation schema
 * @controller
 *   - handleCreatePost: Handles the business logic for post creation
 */
router.post(
  "/create-post",
  authenticate,
  uploadMultiple("media", 5),
  validateRequest(postValidator.create),
  handleCreatePost as RequestHandler
);

// The following routes are currently disabled. Uncomment to enable:

/**
 * @route   GET /public
 * @desc    Get public posts for users not logged in
 * @access  Public
 */
router.get("/public", handleGetPostsForNotLoginUser);

/**
 * @route   GET /feed
 * @desc    Get personalized feed for logged-in users
 * @access  Private (requires authentication)
 */
// router.get("/feed", authenticate, handleGetPostForLoginUser);

/**
 * @route   DELETE /
 * @desc    (Route not implemented) Delete a post
 */
// router.delete("/");

export default router;
