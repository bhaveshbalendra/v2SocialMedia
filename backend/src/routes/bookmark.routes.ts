// import { Router } from "express";
// import {
//   createBookmark,
//   getUserBookmarks,
//   removeBookmark,
// } from "../controllers/bookmark.controller";
// import { authenticate } from "../middlewares/auth.middleware";

// const router = Router();

// /**
//  * @route   POST /api/v2/bookmarks/:postId
//  * @desc    Bookmark a post
//  * @access  Private
//  */
// router.post("/:postId", authenticate, createBookmark);

// /**
//  * @route   DELETE /api/v2/bookmarks/:postId
//  * @desc    Remove bookmark
//  * @access  Private
//  */
// router.delete("/:postId", authenticate, removeBookmark);

// /**
//  * @route   GET /api/v2/bookmarks
//  * @desc    Get user's bookmarks
//  * @access  Private
//  */
// router.get("/", authenticate, getUserBookmarks);

// export default router;
