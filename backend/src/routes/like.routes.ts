import { RequestHandler, Router } from "express";
import {
  handleLikePost,
  handleUnLikePost,
} from "../controller/like.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/v2/post/:postId/likes
 * @desc Like a post
 * @access Private (requires authentication)
 */
router.post("/:postId/likes", authenticate, handleLikePost as RequestHandler);

/**
 * @route DELETE /api/v2/post/:postId/unlike
 * @desc Unlike a post
 * @access Private (requires authentication)
 */
router.delete(
  "/:postId/unlike",
  authenticate,
  handleUnLikePost as RequestHandler
);

export default router;
