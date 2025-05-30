import { Router } from "express";
import {
  createComment,
  createReply,
  deleteComment,
  getCommentReplies,
  getPostComments,
  toggleCommentLike,
  updateComment,
} from "../controller/comment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validator.middleware";
import { commentValidator } from "../utils/validators.util";

const router = Router();

/**
 * @route   POST /api/v2/comments/:postId
 * @desc    Create a comment on a post
 * @access  Private
 */
router.post(
  "/:postId",
  authenticate,
  validateRequest(commentValidator.create),
  createComment
);

/**
 * @route   POST /api/v2/comments/:commentId/reply
 * @desc    Reply to a comment
 * @access  Private
 */
router.post(
  "/:commentId/reply",
  authenticate,
  validateRequest(commentValidator.create),
  createReply
);

/**
 * @route   GET /api/v2/comments/:postId
 * @desc    Get comments for a post
 * @access  Public
 */
router.get("/:postId", getPostComments);

/**
 * @route   GET /api/v2/comments/:commentId/replies
 * @desc    Get replies for a comment
 * @access  Public
 */
router.get("/:commentId/replies", getCommentReplies);

/**
 * @route   PUT /api/v2/comments/:commentId
 * @desc    Update a comment
 * @access  Private
 */
router.put(
  "/:commentId",
  authenticate,
  validateRequest(commentValidator.update),
  updateComment
);

/**
 * @route   DELETE /api/v2/comments/:commentId
 * @desc    Delete a comment
 * @access  Private
 */
router.delete("/:commentId", authenticate, deleteComment);

/**
 * @route   POST /api/v2/comments/:commentId/like
 * @desc    Like/Unlike a comment
 * @access  Private
 */
router.post("/:commentId/like", authenticate, toggleCommentLike);

export default router;
