import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import commentService from "../service/comment.service";

// Create a comment on a post
const handleCreateComment = asyncHandler(
  async (request: Request, response: Response) => {
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

// Create a reply to a comment
const handleCreateReply = asyncHandler(
  async (request: Request, response: Response) => {
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

// Get comments for a post
const handleGetPostComments = asyncHandler(
  async (request: Request, response: Response) => {
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

// Get replies for a comment
const handleGetCommentReplies = asyncHandler(
  async (request: Request, response: Response) => {
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

// Update a comment
const handleUpdateComment = asyncHandler(
  async (request: Request, response: Response) => {
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

// Delete a comment
const handleDeleteComment = asyncHandler(
  async (request: Request, response: Response) => {
    const { commentId } = request.params;
    const userId = request.user._id;

    const result = await commentService.deleteComment(userId, commentId);

    response.status(200).json({
      success: true,
      ...result,
    });
  }
);

// Like or unlike a comment
const handleToggleCommentLike = asyncHandler(
  async (request: Request, response: Response) => {
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
  handleCreateComment,
  handleCreateReply,
  handleDeleteComment,
  handleGetCommentReplies,
  handleGetPostComments,
  handleToggleCommentLike,
  handleUpdateComment,
};
