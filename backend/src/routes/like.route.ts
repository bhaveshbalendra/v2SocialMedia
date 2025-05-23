// import { Router } from "express";
// import {
//   getPostLikes,
//   likeComment,
//   likePost,
//   unlikeComment,
//   unlikePost,
// } from "../controllers/like.controller";
// import { authenticate } from "../middlewares/auth.middleware";
// import { userActionRateLimiter } from "../middlewares/rateLimiter.middleware";

// const router = Router();

// /**
//  * @route   POST /api/v2/likes/post/:postId
//  * @desc    Like a post
//  * @access  Private
//  */
// router.post("/post/:postId", authenticate, userActionRateLimiter, likePost);

// /**
//  * @route   DELETE /api/v2/likes/post/:postId
//  * @desc    Unlike a post
//  * @access  Private
//  */
// router.delete("/post/:postId", authenticate, userActionRateLimiter, unlikePost);

// /**
//  * @route   POST /api/v2/likes/comment/:commentId
//  * @desc    Like a comment
//  * @access  Private
//  */
// router.post(
//   "/comment/:commentId",
//   authenticate,
//   userActionRateLimiter,
//   likeComment
// );

// /**
//  * @route   DELETE /api/v2/likes/comment/:commentId
//  * @desc    Unlike a comment
//  * @access  Private
//  */
// router.delete(
//   "/comment/:commentId",
//   authenticate,
//   userActionRateLimiter,
//   unlikeComment
// );

// /**
//  * @route   GET /api/v2/likes/post/:postId
//  * @desc    Get likes for a post
//  * @access  Private
//  */
// router.get("/post/:postId", authenticate, getPostLikes);

// export default router;
