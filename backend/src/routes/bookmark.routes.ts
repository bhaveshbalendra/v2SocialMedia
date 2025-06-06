import { Router } from "express";
import {
  getBookmarkStatus,
  getUserBookmarks,
  removeBookmark,
  toggleBookmark,
} from "../controller/bookmark.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   POST /api/v2/bookmarks/:postId/toggle
 * @desc    Toggle bookmark for a post
 * @access  Private
 */
router.post("/:postId/toggle", authenticate, toggleBookmark);

/**
 * @route   DELETE /api/v2/bookmarks/:postId
 * @desc    Remove bookmark
 * @access  Private
 */
router.delete("/:postId", authenticate, removeBookmark);

/**
 * @route   GET /api/v2/bookmarks/:postId/status
 * @desc    Check bookmark status for a post
 * @access  Private
 */
router.get("/:postId/status", authenticate, getBookmarkStatus);

/**
 * @route   GET /api/v2/bookmarks
 * @desc    Get user's bookmarks
 * @access  Private
 */
router.get("/", authenticate, getUserBookmarks);

export default router;
