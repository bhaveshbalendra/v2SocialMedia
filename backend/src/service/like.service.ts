import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import Post from "../models/post.model";
import User from "../models/user.model";
import { NotificationType } from "../types/notification.types";
import { IPostLikeParameter, IPostUnLikeParameter } from "../types/post.types";
import { io, userSocketMap } from "../utils/socket.util";
import notificationService from "./notification.service";

class LikeService {
  async like({ likedUserId, postId }: IPostLikeParameter) {
    const userWhoLike = await User.findById(likedUserId);

    if (!userWhoLike) {
      throw AppError.notFoundError("User");
    }

    const likedPost = await Post.findById(postId);

    if (!likedPost) {
      throw AppError.notFoundError("Post");
    }
    const userWhoLikeId = new Types.ObjectId(userWhoLike._id);

    if (!likedPost.likes.includes(userWhoLikeId)) {
      const updatedPost = await likedPost.updateOne({
        $addToSet: {
          likes: userWhoLike._id,
        },
      });

      // Create notification for post author (only if it's not the same user)
      if (likedPost.author._id.toString() !== userWhoLike._id.toString()) {
        const content = notificationService.generateContent(
          NotificationType.POST_LIKED,
          userWhoLike.username
        );

        await notificationService.createNotification({
          sender: userWhoLike._id,
          recipient: likedPost.author._id,
          type: NotificationType.POST_LIKED,
          content,
          entityId: likedPost._id,
          entityModel: "Post",
        });
      }

      // Emit to all connected users except the one who liked
      for (const [userId, socketIds] of userSocketMap.entries()) {
        if (userId !== userWhoLike._id.toString()) {
          socketIds.forEach((socketId) => {
            io.to(socketId).emit("postLiked", {
              postId: likedPost._id,
              userId: userWhoLike._id,
            });
          });
        }
      }
    }
    return;
  }

  async unlike({ unlikedUserId, postId }: IPostUnLikeParameter) {
    const userWhoUnLike = await User.findById(unlikedUserId);

    if (!userWhoUnLike) {
      throw AppError.notFoundError("User");
    }

    const unLikedPost = await Post.findById(postId);

    if (!unLikedPost) {
      throw AppError.notFoundError("Post");
    }
    const userWhoUnLikeId = new Types.ObjectId(userWhoUnLike._id);

    if (unLikedPost.likes.includes(userWhoUnLikeId)) {
      await unLikedPost.updateOne({
        $pull: {
          likes: userWhoUnLike._id,
        },
      });

      // Emit to all connected users except the one who unliked
      for (const [userId, socketIds] of userSocketMap.entries()) {
        if (userId !== userWhoUnLike._id.toString()) {
          socketIds.forEach((socketId) => {
            io.to(socketId).emit("postUnliked", {
              postId: unLikedPost._id,
              userId: userWhoUnLike._id,
              username: userWhoUnLike.username,
              likesCount: unLikedPost.likes.length - 1,
            });
          });
        }
      }
    }
    return;
  }
}

export default new LikeService();
