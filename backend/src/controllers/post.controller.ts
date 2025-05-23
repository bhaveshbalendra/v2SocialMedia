import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import postService from "../services/post.service";

/**
 * @description Handler for creating post
 * @param {Request} request - The request object containing user data.
 * @param {Response} response - The response object to send the result.
 * @returns {Promise<any>} - A promise that resolves to the response object.
 * @throws {AppError} - Throws an app error if any issue in post and catch by express async handler and processed by middleware
 */
const handleCreatePost = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    //call the create post service with request as argument
    const post = await postService.createPost(request);

    response
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
    return;
  }
);

/**
 * @description Get post for user which are not login and show post which are public
 * @return {Promise<>}
 */

const handleGetPostsForNotLoginUser = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    const posts = await postService.getAllPostsNotLoginUser();

    response
      .status(200)
      .json({ success: true, message: "Post are Fetched", posts });
    return;
  }
);

/**
 * @description Get post for login user which they follow and public post also
 */

const handleGetPostForLoginUser = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {}
);

/**
 * @description Delete post by id
 */
const handleDeletePost = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {}
);

const handleLikePost = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;

    const { _id: likedUserId } = request.user;

    await postService.like({ likedUserId, postId });

    response.status(200).json({ success: true, message: "Post Liked", posts });

    return;
  }
);

const handleUnLikePost = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {}
);

export {
  handleCreatePost,
  handleDeletePost,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
  handleLikePost,
  handleUnLikePost,
};
