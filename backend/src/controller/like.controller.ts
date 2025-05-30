import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import likeService from "../service/like.service";
/**
 * @description Like Post
 * @route POST /api/v2/post/:postId/likes
 * @access Private
 * @param {string} postId - The id of the post to like
 * @returns {Promise<any>} - A promise that resolves to the response object
 */

const handleLikePost = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    const { postId } = request.params;
    const { _id: likedUserId } = request.user;

    await likeService.like({ likedUserId, postId });

    response.status(200).json({ success: true, message: "Post Liked" });

    return;
  }
);

const handleUnLikePost = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const { _id: unlikedUserId } = request.user;

    await likeService.unlike({ unlikedUserId, postId });

    response.status(200).json({ success: true, message: "Post Unliked" });

    return;
  }
);

export { handleLikePost, handleUnLikePost };
