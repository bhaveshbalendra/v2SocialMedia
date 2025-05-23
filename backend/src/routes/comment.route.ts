import { Router } from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  replyToComment,
  updateComment,
} from "../controllers/comment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validator.middleware";
import { commentValidation } from "../utils/validators";

const router = Router();

/**
 * @route   POST /api/v2/comments/:postId
 * @desc    Create a comment on a post
 * @access  Private
 */
router.post(
  "/:postId",
  authenticate,
  validateRequest(commentValidation.create),
  createComment
);

/**
 * @route   PUT /api/v2/comments/:commentId
 * @desc    Update a comment
 * @access  Private
 */
router.put(
  "/:commentId",
  authenticate,
  validateRequest(commentValidation.update),
  updateComment
);

/**
 * @route   DELETE /api/v2/comments/:commentId
 * @desc    Delete a comment
 * @access  Private
 */
router.delete("/:commentId", authenticate, deleteComment);

/**
 * @route   GET /api/v2/comments/:postId
 * @desc    Get comments for a post
 * @access  Private
 */
router.get("/:postId", authenticate, getPostComments);

/**
 * @route   POST /api/v2/comments/:commentId/reply
 * @desc    Reply to a comment
 * @access  Private
 */
router.post(
  "/:commentId/reply",
  authenticate,
  validateRequest(commentValidation.create),
  replyToComment
);

export default router;
