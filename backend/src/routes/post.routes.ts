import express, { RequestHandler, Router } from "express";
import {
  handleCreatePost,
  handleDebugPosts,
  handleDeletePost,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
} from "../controller/post.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadMultiple } from "../middleware/upload.middleware";
import { validateRequest } from "../middleware/validator.middleware";
import { postValidator } from "../utils/validators.util";

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
router.get("/feed", authenticate, handleGetPostForLoginUser);

/**
 * @route   GET /debug
 * @desc    Debug endpoint to check posts in database
 * @access  Public (for debugging)
 */
router.get("/debug", handleDebugPosts);

/**
 * @route   DELETE /:postId/delete
 * @desc    Delete a post
 * @access  Private (requires authentication)
 */
router.delete(
  "/:postId/delete",
  authenticate,
  handleDeletePost as RequestHandler
);

// /**
//  * @route POST /api/v2/post/:postId/comment
//  */
// router.post("/:postId/comment");

// /**
//  * @route POST /api/v2/post/:postId/comment/all
//  */
// router.post("/:postId/comment/all");

// /**
//  * @route POST /api/v2/post/:postId/bookmark
//  */
// router.post("/:postId/bookmark");

// /**
//  * @route Delete /api/v2/post/:postId/bookmark
//  */
// router.delete("/:postId/bookmark");

export default router;
