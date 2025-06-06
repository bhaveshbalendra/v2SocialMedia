import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bookmarkService from "../service/bookmark.service";

/**
 * @description Toggle bookmark for a post
 * @route POST/DELETE /api/v2/bookmarks/:postId/toggle
 * @access Private
 */
const toggleBookmark = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const userId = request.user._id.toString();

    const result = await bookmarkService.toggleBookmark({
      userId,
      postId,
    });

    response.status(200).json({
      success: true,
      ...result,
    });
  }
);

/**
 * @description Get user's bookmarked posts
 * @route GET /api/v2/bookmarks
 * @access Private
 */
const getUserBookmarks = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const userId = request.user._id.toString();
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await bookmarkService.getUserBookmarks(userId, page, limit);

    response.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully",
      ...result,
    });
  }
);

/**
 * @description Remove bookmark from a post
 * @route DELETE /api/v2/bookmarks/:postId
 * @access Private
 */
const removeBookmark = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const userId = request.user._id.toString();

    const result = await bookmarkService.removeBookmark(userId, postId);

    response.status(200).json({
      success: true,
      ...result,
    });
  }
);

/**
 * @description Check if user has bookmarked a post
 * @route GET /api/v2/bookmarks/:postId/status
 * @access Private
 */
const getBookmarkStatus = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const userId = request.user._id.toString();

    const isBookmarked = await bookmarkService.isPostBookmarked(userId, postId);

    response.status(200).json({
      success: true,
      isBookmarked,
    });
  }
);

export { getBookmarkStatus, getUserBookmarks, removeBookmark, toggleBookmark };
