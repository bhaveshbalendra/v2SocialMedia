import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import FollowRequest from "../models/followRequest";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import {
  CreateNotificationParams,
  EntityModelType,
  INotification,
  IPopulatedNotification,
  NotificationType,
} from "../types/notification.types";
import { io, userSocketMap } from "../utils/socket.util";

class NotificationService {
  // Create a new notification and emit through socket.io
  async createNotification({
    sender,
    recipient,
    type,
    content,
    entityId,
    entityModel,
  }: CreateNotificationParams): Promise<void> {
    try {
      // Check if recipient exists
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        throw AppError.notFoundError("Recipient user not found");
      }

      // Create notification in database
      const notification = await Notification.create({
        sender,
        recipient,
        type,
        content,
        entityId,
        entityModel,
        read: false,
      });

      // Add notification to user's notifications array
      recipientUser.notification.push(new Types.ObjectId(notification._id));
      await recipientUser.save();

      const recipientSockets = userSocketMap.get(recipientUser._id.toString());

      if (recipientSockets && recipientSockets.length > 0) {
        recipientSockets.forEach((socketId) => {
          // Emit through socket.io if recipient is online
          io.to(socketId).emit("notification", {
            _id: notification._id,
            type,
            sender,
            recipient,
            content,
            entityId,
            entityModel,
            createdAt: notification.createdAt,
          });
        });
      }

      return;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Helper method to generate content based on notification type
  generateContent(type: NotificationType, senderUsername: string): string {
    switch (type) {
      case NotificationType.FOLLOW_REQUEST:
        return `${senderUsername} sent you a follow request`;
      case NotificationType.FOLLOW_ACCEPTED:
        return `${senderUsername} accepted your follow request`;
      case NotificationType.FOLLOWED:
        return `${senderUsername} started following you`;
      case NotificationType.POST_LIKED:
        return `${senderUsername} liked your post`;
      case NotificationType.POST_COMMENTED:
        return `${senderUsername} commented on your post`;
      case NotificationType.POST_SHARED:
        return `${senderUsername} shared your post`;
      case NotificationType.COMMENT_LIKED:
        return `${senderUsername} liked your comment`;
      case NotificationType.COMMENT_REPLIED:
        return `${senderUsername} replied to your comment`;
      case NotificationType.MESSAGE_RECEIVED:
        return `${senderUsername} sent you a message`;
      case NotificationType.USER_MENTIONED:
        return `${senderUsername} mentioned you in a post`;
      case NotificationType.TAGGED_IN_POST:
        return `${senderUsername} tagged you in a post`;
      default:
        return `New notification from ${senderUsername}`;
    }
  }

  // Get all notifications for a user
  async getUserNotifications(
    userId: string
  ): Promise<IPopulatedNotification[]> {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate("sender", "username profilePicture")
        .lean();

      // Manually populate entityId based on entityModel
      const populatedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          if (notification.entityId && notification.entityModel) {
            switch (notification.entityModel) {
              case "FollowRequest":
                const followRequest = await FollowRequest.findById(
                  notification.entityId
                )
                  .populate("from", "username profilePicture")
                  .populate("to", "username profilePicture")
                  .lean();
                return {
                  ...notification,
                  entityData: followRequest,
                };
              case "User":
                const user = await User.findById(notification.entityId)
                  .select("username profilePicture")
                  .lean();
                return {
                  ...notification,
                  entityData: user,
                };
              case "Post":
                // Import Post model dynamically to avoid circular dependencies
                const Post = (await import("../models/post.model")).default;
                const post = await Post.findById(notification.entityId)
                  .select("title media")
                  .lean();
                return {
                  ...notification,
                  entityData: post,
                };
              default:
                return notification;
            }
          }
          return notification;
        })
      );

      return populatedNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true },
        { new: true }
      );

      if (!notification) {
        throw AppError.notFoundError("Notification not found");
      }

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<void> {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        recipient: userId,
      });

      if (result.deletedCount === 0) {
        throw AppError.notFoundError("Notification not found");
      }

      // Remove from user's notifications array
      await User.updateOne(
        { _id: userId },
        { $pull: { notification: notificationId } }
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Delete all notifications for a user
  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      // Get all notification IDs for the user
      const notifications = await Notification.find({
        recipient: userId,
      }).select("_id");
      const notificationIds = notifications.map((n) => n._id);

      // Delete all notifications
      await Notification.deleteMany({ recipient: userId });

      // Clear user's notifications array
      await User.updateOne({ _id: userId }, { $set: { notification: [] } });
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      throw error;
    }
  }
}

export default new NotificationService();
