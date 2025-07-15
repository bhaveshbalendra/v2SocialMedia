import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import commentService from "../service/comment.service";

/**
 * @description Create a comment on a post
 * @route POST /api/v2/comments/:postId
 * @access Private
 */

const createComment = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const { content } = request.body;
    const userId = request.user._id;

    const comment = await commentService.createComment({
      userId,
      postId,
      content,
    });

    response.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  }
);

/**
 * @description Create a reply to a comment
 * @route POST /api/v2/comments/:commentId/reply
 * @access Private
 */
const createReply = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { commentId } = request.params;
    const { content } = request.body;
    const userId = request.user._id;

    const reply = await commentService.createReply({
      userId,
      commentId,
      content,
    });

    response.status(201).json({
      success: true,
      message: "Reply created successfully",
      comment: reply,
    });
  }
);

/**
 * @description Get comments for a post
 * @route GET /api/v2/comments/:postId
 * @access Public
 */
const getPostComments = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { postId } = request.params;
    const cursor = (request.query.nextCursor as string) || null;

    const result = await commentService.getPostComments(postId, cursor);

    response.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      ...result,
    });
  }
);

/**
 * @description Get replies for a comment
 * @route GET /api/v2/comments/:commentId/replies
 * @access Public
 */
const getCommentReplies = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { commentId } = request.params;
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await commentService.getCommentReplies(
      commentId,
      page,
      limit
    );

    response.status(200).json({
      success: true,
      message: "Replies fetched successfully",
      ...result,
    });
  }
);

/**
 * @description Update a comment
 * @route PUT /api/v2/comments/:commentId
 * @access Private
 */
const updateComment = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { commentId } = request.params;
    const { content } = request.body;
    const userId = request.user._id;

    const comment = await commentService.updateComment({
      userId,
      commentId,
      content,
    });

    response.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  }
);

/**
 * @description Delete a comment
 * @route DELETE /api/v2/comments/:commentId
 * @access Private
 */
const deleteComment = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { commentId } = request.params;
    const userId = request.user._id;

    const result = await commentService.deleteComment(userId, commentId);

    response.status(200).json({
      success: true,
      ...result,
    });
  }
);

/**
 * @description Like/Unlike a comment
 * @route POST /api/v2/comments/:commentId/like
 * @access Private
 */
const toggleCommentLike = asyncHandler(
  async (request: Request, response: Response): Promise<any> => {
    const { commentId } = request.params;
    const userId = request.user._id;

    const result = await commentService.toggleCommentLike({
      userId,
      commentId,
    });

    response.status(200).json({
      success: true,
      ...result,
    });
  }
);

export {
  createComment,
  createReply,
  deleteComment,
  getCommentReplies,
  getPostComments,
  toggleCommentLike,
  updateComment,
};
