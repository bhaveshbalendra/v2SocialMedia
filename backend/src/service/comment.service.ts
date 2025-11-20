import { Types } from "mongoose";
import { config } from "../config/app.config";
import { AppError } from "../middleware/error.middleware";
import Comment from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { NotificationType } from "../types/notification.types";
import { io, userSocketMap } from "../utils/socket.util";
import notificationService from "./notification.service";

interface ICreateCommentParams {
  userId: string;
  postId: string;
  content: string;
}

interface ICreateReplyParams {
  userId: string;
  commentId: string;
  content: string;
}

interface IUpdateCommentParams {
  userId: string;
  commentId: string;
  content: string;
}

interface ILikeCommentParams {
  userId: string;
  commentId: string;
}

class CommentService {
  // Create a new comment on a post
  async createComment({ userId, postId, content }: ICreateCommentParams) {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw AppError.notFoundError("Post not found");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    // Create the comment
    const comment = await Comment.create({
      user: userId,
      post: postId,
      content,
    });

    // Update post's comments count
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
      $inc: { commentsCount: 1 },
    });

    // Create notification for post author (if not commenting on own post)
    if (post.author.toString() !== userId) {
      const notificationContent = notificationService.generateContent(
        NotificationType.POST_COMMENTED,
        user.username
      );

      await notificationService.createNotification({
        sender: new Types.ObjectId(userId),
        recipient: post.author,
        type: NotificationType.POST_COMMENTED,
        content: notificationContent,
        entityId: comment._id,
        entityModel: "Comment",
      });
    }

    // Populate the comment with user details
    const populatedComment = await Comment.findById(comment._id)
      .populate({
        path: "user",
        select: "username profilePicture ",
      })
      .select("-updatedAt -__v ");

    // Emit real-time comment update to post author only (if not commenting on own post)
    if (post.author.toString() !== userId) {
      const postAuthorId = post.author.toString();
      const postAuthorSockets = userSocketMap.get(postAuthorId);

      if (postAuthorSockets && postAuthorSockets.length > 0) {
        postAuthorSockets.forEach((socketId) => {
          io.to(socketId).emit("newComment", {
            postId: postId,
            comment: populatedComment,
          });
        });
      }
    }

    return populatedComment;
  }

  // Create a reply to a comment
  async createReply({ userId, commentId, content }: ICreateReplyParams) {
    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId).populate("post");
    if (!parentComment) {
      throw AppError.notFoundError("Comment not found");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    // Create the reply
    const reply = await Comment.create({
      user: userId,
      post: parentComment.post._id,
      content,
      parentComment: commentId,
    });

    // Update post's comments count
    await Post.findByIdAndUpdate(parentComment.post._id, {
      $push: { comments: reply._id },
      $inc: { commentsCount: 1 },
    });

    // Create notification for comment author (if not replying to own comment)
    if (parentComment.user.toString() !== userId) {
      const notificationContent = notificationService.generateContent(
        NotificationType.COMMENT_REPLIED,
        user.username
      );

      await notificationService.createNotification({
        sender: new Types.ObjectId(userId),
        recipient: parentComment.user,
        type: NotificationType.COMMENT_REPLIED,
        content: notificationContent,
        entityId: reply._id,
        entityModel: "Comment",
      });
    }

    // Populate the reply with user details
    const populatedReply = await Comment.findById(reply._id).populate({
      path: "user",
      select: "username profilePicture",
    });

    return populatedReply;
  }

  // Get comments for a post
  async getPostComments(postId: string, cursor: string | null = null) {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw AppError.notFoundError("Post not found");
    }

    // Get parent comments (not replies)
    const comments = await Comment.find({
      post: postId,
      createdAt: cursor ? { $lt: new Date(cursor) } : { $exists: true },
    })
      .sort({ createdAt: -1 })
      .limit(config.comment_limit) // Use commentLimit from config
      .populate({
        path: "user",
        select: "username profilePicture _id",
      });

    const nextCursor =
      comments.length > 0
        ? comments[comments.length - 1].createdAt.toISOString()
        : null;
    const hasMore = comments.length === config.comment_limit;

    // Get replies for each comment
    // const commentsWithReplies = await Promise.all(
    //   comments.map(async (comment) => {
    //     const replies = await Comment.find({
    //       parentComment: comment._id,
    //     })
    //       .populate({
    //         path: "user",
    //         select: "username profilePicture",
    //       })
    //       .sort({ createdAt: 1 })
    //       .limit(5); // Limit replies shown initially

    //     return {
    //       ...comment.toObject(),
    //       replies,
    //       repliesCount: await Comment.countDocuments({
    //         parentComment: comment._id,
    //       }),
    //     };
    //   })
    // );

    // const totalComments = await Comment.countDocuments({
    //   post: postId,
    //   parentComment: null,
    // });

    return {
      postId,
      comments,
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  }

  // Update a comment
  async updateComment({ userId, commentId, content }: IUpdateCommentParams) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw AppError.notFoundError("Comment not found");
    }

    // Check if user owns the comment
    if (comment.user.toString() !== userId) {
      throw AppError.unauthorizedError("You can only edit your own comments");
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    ).populate({
      path: "user",
      select: "username profilePicture",
    });

    return updatedComment;
  }

  // Delete a comment
  async deleteComment(userId: string, commentId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw AppError.notFoundError("Comment not found");
    }

    // Check if user owns the comment
    if (comment.user.toString() !== userId) {
      throw AppError.unauthorizedError("You can only delete your own comments");
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: commentId });

    // Count total comments being deleted (parent + replies)
    const repliesCount = await Comment.countDocuments({
      parentComment: commentId,
    });
    const totalDeleted = repliesCount + 1;

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Update post's comments count and remove comment reference
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
      $inc: { commentsCount: -totalDeleted },
    });

    return { message: "Comment deleted successfully" };
  }

  // Like/Unlike a comment
  async toggleCommentLike({ userId, commentId }: ILikeCommentParams) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw AppError.notFoundError("Comment not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    const userObjectId = new Types.ObjectId(userId);
    const isLiked = comment.likes.includes(userObjectId);

    if (isLiked) {
      // Unlike the comment
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: userObjectId },
        $inc: { likesCount: -1 },
      });

      return { message: "Comment unliked", isLiked: false };
    } else {
      // Like the comment
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userObjectId },
        $inc: { likesCount: 1 },
      });

      // Create notification for comment author (if not liking own comment)
      if (comment.user.toString() !== userId) {
        const notificationContent = notificationService.generateContent(
          NotificationType.COMMENT_LIKED,
          user.username
        );

        await notificationService.createNotification({
          sender: userObjectId,
          recipient: comment.user,
          type: NotificationType.COMMENT_LIKED,
          content: notificationContent,
          entityId: comment._id,
          entityModel: "Comment",
        });
      }

      return { message: "Comment liked", isLiked: true };
    }
  }

  // Get replies for a specific comment
  async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const replies = await Comment.find({
      parentComment: commentId,
    })
      .populate({
        path: "user",
        select: "username profilePicture",
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const totalReplies = await Comment.countDocuments({
      parentComment: commentId,
    });

    return {
      replies,
      pagination: {
        page,
        limit,
        total: totalReplies,
        pages: Math.ceil(totalReplies / limit),
        hasMore: page * limit < totalReplies,
      },
    };
  }
}

export default new CommentService();
