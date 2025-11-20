import { Router } from "express";
import {
  handleLikePost,
  handleUnlikePost,
} from "../controller/like.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Like a post
router.post("/:postId/likes", authenticate, handleLikePost);

// Unlike a post
router.delete("/:postId/unlike", authenticate, handleUnlikePost);

export default router;
