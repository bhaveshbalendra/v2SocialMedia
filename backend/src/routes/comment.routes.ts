import { Router } from "express";
import {
  handleCreateComment,
  handleCreateReply,
  handleDeleteComment,
  handleGetCommentReplies,
  handleGetPostComments,
  handleToggleCommentLike,
  handleUpdateComment,
} from "../controller/comment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validator.middleware";
import { commentValidator } from "../utils/validators.util";

const router = Router();

// Create a comment on a post
router.post(
  "/:postId",
  authenticate,
  validateRequest(commentValidator.create),
  handleCreateComment
);

// Reply to a comment
router.post(
  "/:commentId/reply",
  authenticate,
  validateRequest(commentValidator.create),
  handleCreateReply
);

// Get comments for a post
router.get("/:postId", handleGetPostComments);

// Get replies for a comment
router.get("/:commentId/replies", handleGetCommentReplies);

// Update a comment
router.put(
  "/:commentId",
  authenticate,
  validateRequest(commentValidator.update),
  handleUpdateComment
);

// Delete a comment
router.delete("/:commentId", authenticate, handleDeleteComment);

// Like or unlike a comment
router.post("/:commentId/like", authenticate, handleToggleCommentLike);

export default router;
