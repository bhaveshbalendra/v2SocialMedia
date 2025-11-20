import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import notificationService from "../service/notification.service";

// Get all notifications for a user
const handleGetNotifications = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    const notifications = await notificationService.getUserNotifications(
      userId
    );

    response.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  }
);

// Mark a notification as read
const handleMarkNotificationAsRead = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const notificationId = request.params.id;

    await notificationService.markAsRead(notificationId, userId);

    response.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  }
);

// Mark all notifications as read
const handleMarkAllNotificationsAsRead = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    await notificationService.markAllAsRead(userId);

    response.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  }
);

// Delete a notification
const handleDeleteNotification = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const notificationId = request.params.id;

    await notificationService.deleteNotification(notificationId, userId);

    response.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  }
);

// Get unread notification count
const handleGetUnreadCount = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    const notifications = await notificationService.getUserNotifications(
      userId
    );
    const unreadCount = notifications.filter((n) => !n.read).length;

    response.status(200).json({
      success: true,
      data: { count: unreadCount },
    });
  }
);

// Delete all notifications for a user
const handleDeleteAllNotifications = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    await notificationService.deleteAllNotifications(userId);

    response.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  }
);

export {
  handleDeleteAllNotifications,
  handleDeleteNotification,
  handleGetNotifications,
  handleGetUnreadCount,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
};
