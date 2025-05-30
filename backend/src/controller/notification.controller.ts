import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import notificationService from "../service/notification.service";

/**
 * Notification Controller
 * Handles user notification management
 */
const NotificationController = {
  /**
   * @desc    Get all notifications for a user
   * @route   GET /api/notifications
   * @access  Private
   */
  getNotifications: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const notifications = await notificationService.getUserNotifications(
      userId.toString()
    );

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  }),

  /**
   * @desc    Mark a notification as read
   * @route   PATCH /api/notifications/:id/read
   * @access  Private
   */
  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const notificationId = req.params.id;

    await notificationService.markAsRead(notificationId, userId.toString());

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  }),

  /**
   * @desc    Mark all notifications as read
   * @route   PATCH /api/notifications/read-all
   * @access  Private
   */
  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    await notificationService.markAllAsRead(userId.toString());

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  }),

  /**
   * @desc    Delete a notification
   * @route   DELETE /api/notifications/:id
   * @access  Private
   */
  deleteNotification: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const notificationId = req.params.id;

    await notificationService.deleteNotification(
      notificationId,
      userId.toString()
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  }),

  /**
   * @desc    Get unread notification count
   * @route   GET /api/notifications/unread-count
   * @access  Private
   */
  getUnreadCount: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const notifications = await notificationService.getUserNotifications(
      userId.toString()
    );
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      data: { count: unreadCount },
    });
  }),
};

export default NotificationController;
