import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import Post from "../models/post.model";
import User from "../models/user.model";
import { NotificationType } from "../types/notification.types";
import notificationService from "./notification.service";

interface IToggleBookmarkParams {
  userId: string;
  postId: string;
}

class BookmarkService {
  /**
   * Toggle bookmark status for a post
   */
  async toggleBookmark({ userId, postId }: IToggleBookmarkParams) {
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

    // Check if user has already bookmarked this post
    const isBookmarked = user.bookmarks.includes(new Types.ObjectId(postId));

    if (isBookmarked) {
      // Remove bookmark
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: postId },
      });

      await Post.findByIdAndUpdate(postId, {
        $inc: { bookmarksCount: -1 },
      });

      return {
        message: "Bookmark removed successfully",
        isBookmarked: false,
      };
    } else {
      // Add bookmark
      await User.findByIdAndUpdate(userId, {
        $push: { bookmarks: postId },
      });

      await Post.findByIdAndUpdate(postId, {
        $inc: { bookmarksCount: 1 },
      });

      // Create notification for post author (if not bookmarking own post)
      if (post.author.toString() !== userId) {
        const notificationContent = notificationService.generateContent(
          NotificationType.POST_LIKED,
          user.username
        );

        await notificationService.createNotification({
          sender: new Types.ObjectId(userId),
          recipient: post.author,
          type: NotificationType.POST_LIKED,
          content: notificationContent,
          entityId: post._id,
          entityModel: "Post",
        });
      }

      return {
        message: "Post bookmarked successfully",
        isBookmarked: true,
      };
    }
  }

  /**
   * Get user's bookmarked posts
   */
  async getUserBookmarks(userId: string, page: number = 1, limit: number = 10) {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    const skip = (page - 1) * limit;

    // Get user with populated bookmarks
    const userWithBookmarks = await User.findById(userId)
      .populate({
        path: "bookmarks",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
        ],
        options: {
          sort: { createdAt: -1 },
          skip: skip,
          limit: limit,
        },
      })
      .select("bookmarks");

    const totalBookmarks = user.bookmarks.length;

    return {
      bookmarks: userWithBookmarks?.bookmarks || [],
      pagination: {
        page,
        limit,
        total: totalBookmarks,
        pages: Math.ceil(totalBookmarks / limit),
        hasMore: page * limit < totalBookmarks,
      },
    };
  }

  /**
   * Check if user has bookmarked a post
   */
  async isPostBookmarked(userId: string, postId: string) {
    const user = await User.findById(userId).select("bookmarks");
    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    return user.bookmarks.includes(new Types.ObjectId(postId));
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(userId: string, postId: string) {
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

    // Check if user has bookmarked this post
    const isBookmarked = user.bookmarks.includes(new Types.ObjectId(postId));
    if (!isBookmarked) {
      throw AppError.emptyOrInvalidData("Post is not bookmarked");
    }

    // Remove bookmark
    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: postId },
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { bookmarksCount: -1 },
    });

    return {
      message: "Bookmark removed successfully",
    };
  }
}

export default new BookmarkService();
