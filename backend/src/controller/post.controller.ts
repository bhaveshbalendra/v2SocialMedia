import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Post from "../models/post.model";
import postService from "../service/post.service";

// Create a new post
const handleCreatePost = asyncHandler(
  async (request: Request, response: Response) => {
    const post = await postService.createPost(request);

    response.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  }
);

// Get public posts for non-authenticated users
const handleGetPostsForNotLoginUser = asyncHandler(
  async (request: Request, response: Response) => {
    const posts = await postService.getAllPostsNotLoginUser();

    response.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  }
);

// Get posts for authenticated users (following + public posts)
const handleGetPostForLoginUser = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const posts = await postService.getPostForLoginUser(userId);

    response.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  }
);

// Delete a post by id
const handleDeletePost = asyncHandler(
  async (request: Request, response: Response) => {
    response.status(501).json({
      success: false,
      message: "Post deletion not yet implemented",
    });
  }
);

// Debug endpoint to check posts in database
const handleDebugPosts = asyncHandler(
  async (request: Request, response: Response) => {
    // Get all posts with their actual field values
    const allPosts = await Post.find({})
      .populate("author", "username")
      .limit(10)
      .sort({ createdAt: -1 });

    const postInfo = allPosts.map((post) => {
      const author = post.author as { _id?: unknown; username?: string } | null;
      return {
        _id: post._id,
        title: post.title || "No title",
        caption: post.caption || "No caption",
        visibility: post.visibility,
        isArchived: post.isArchived,
        isDeleted: post.isDeleted,
        author: {
          _id: author?._id,
          username: author?.username || "No username",
        },
        createdAt: post.createdAt,
      };
    });

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
  }
);

export {
  handleCreatePost,
  handleDebugPosts,
  handleDeletePost,
  handleGetPostForLoginUser,
  handleGetPostsForNotLoginUser,
};
