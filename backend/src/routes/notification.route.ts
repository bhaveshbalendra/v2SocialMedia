// import { Router } from "express";
// import {
//   clearAllNotifications,
//   deleteNotification,
//   getUnreadCount,
//   getUserNotifications,
//   markAllAsRead,
//   markAsRead,
// } from "../controllers/notification.controller";
// import { authenticate } from "../middlewares/auth.middleware";

// const router = Router();

// /**
//  * @route   GET /api/notifications
//  * @desc    Get user's notifications
//  * @access  Private
//  */
// router.get("/", authenticate, getUserNotifications);

// /**
//  * @route   PATCH /api/notifications/:notificationId/mark-read
//  * @desc    Mark a notification as read
//  * @access  Private
//  */
// router.patch("/:notificationId/mark-read", authenticate, markAsRead);

// /**
//  * @route   PATCH /api/notifications/mark-all-read
//  * @desc    Mark all notifications as read
//  * @access  Private
//  */
// router.patch("/mark-all-read", authenticate, markAllAsRead);

// /**
//  * @route   DELETE /api/notifications/:notificationId
//  * @desc    Delete a notification
//  * @access  Private
//  */
// router.delete("/:notificationId", authenticate, deleteNotification);

// /**
//  * @route   DELETE /api/notifications
//  * @desc    Delete all notifications
//  * @access  Private
//  */
// router.delete("/", authenticate, clearAllNotifications);

// /**
//  * @route   GET /api/notifications/unread-count
//  * @desc    Get unread notification count
//  * @access  Private
//  */
// router.get("/unread-count", authenticate, getUnreadCount);

// export default router;
