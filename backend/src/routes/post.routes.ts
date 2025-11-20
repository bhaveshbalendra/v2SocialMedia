import express, { RequestHandler, Router } from "express";
import {
  handleCreatePost,
  handleDebugPosts,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
} from "../controller/post.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadMultiple } from "../middleware/upload.middleware";
import { validateRequest } from "../middleware/validator.middleware";
import { postValidator } from "../utils/validators.util";

// Initialize Express Router instance for post-related routes
const router: Router = Router();

// Create a new post with up to 5 media files
router.post(
  "/create-post",
  authenticate,
  uploadMultiple("media", 5),
  validateRequest(postValidator.create),
  handleCreatePost as RequestHandler
);

// Get public posts for non-authenticated users
router.get("/public", handleGetPostsForNotLoginUser);

// Get personalized feed for authenticated users
router.get("/feed", authenticate, handleGetPostForLoginUser);

// Debug endpoint to check posts in database
router.get("/debug", handleDebugPosts);

export default router;
