import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Post from "../models/post.model";
import postService from "../service/post.service";

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
  ): Promise<any> => {
    const userId = request.user._id;
    const posts = await postService.getPostForLoginUser(userId);

    response
      .status(200)
      .json({ success: true, message: "Posts fetched successfully", posts });
    return;
  }
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

/**
 * @description Debug endpoint to check posts in database
 */
const handleDebugPosts = asyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    // Get all posts with their actual field values
    const allPosts = await Post.find({})
      .populate("author", "username")
      .limit(10)
      .sort({ createdAt: -1 });

    const postInfo = allPosts.map((post: any) => ({
      _id: post._id,
      title: post.title || "No title",
      caption: post.caption || "No caption",
      visibility: post.visibility,
      isArchived: post.isArchived,
      isDeleted: post.isDeleted,
      author: {
        _id: post.author?._id,
        username: post.author?.username || "No username",
      },
      createdAt: post.createdAt,
    }));

    const counts = {
      total: await Post.countDocuments({}),
      public: await Post.countDocuments({ visibility: "public" }),
      private: await Post.countDocuments({ visibility: "private" }),
      archived: await Post.countDocuments({ isArchived: true }),
      deleted: await Post.countDocuments({ isDeleted: true }),
      activePublic: await Post.countDocuments({
        visibility: "public",
        isArchived: false,
        isDeleted: false,
      }),
      activePrivate: await Post.countDocuments({
        visibility: "private",
        isArchived: false,
        isDeleted: false,
      }),
      totalActive: await Post.countDocuments({
        isArchived: false,
        isDeleted: false,
      }),
    };

    // Get some user info for debugging
    const sampleUsers = await postService.getAllPostsNotLoginUser();

    response.status(200).json({
      success: true,
      message: "Debug info",
      counts,
      samplePosts: postInfo,
      publicFeedWorking: sampleUsers.length > 0,
    });
    return;
  }
);

export {
  handleCreatePost,
  handleDebugPosts,
  handleDeletePost,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
};
