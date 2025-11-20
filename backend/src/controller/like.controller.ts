import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import likeService from "../service/like.service";

// Like a post
const handleLikePost = asyncHandler(
  async (request: Request, response: Response) => {
    const { postId } = request.params;
    const likedUserId = request.user._id.toString();

    await likeService.like({ likedUserId, postId });

    response.status(200).json({
      success: true,
      message: "Post liked successfully",
    });
  }
);

// Unlike a post
const handleUnlikePost = asyncHandler(
  async (request: Request, response: Response) => {
    const { postId } = request.params;
    const unlikedUserId = request.user._id.toString();

    await likeService.unlike({ unlikedUserId, postId });

    response.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  }
);

export { handleLikePost, handleUnlikePost };
