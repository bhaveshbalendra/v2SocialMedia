import { Router } from "express";
import {
  handleDeleteAllNotifications,
  handleDeleteNotification,
  handleGetNotifications,
  handleGetUnreadCount,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../controller/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Require authentication for all notification routes
router.use(authenticate);

// Get all notifications
router.get("/", handleGetNotifications);

// Get unread notification count
router.get("/unread-count", handleGetUnreadCount);

// Mark notifications as read
router.patch("/:id/read", handleMarkNotificationAsRead);
router.patch("/read-all", handleMarkAllNotificationsAsRead);

// Delete notifications
router.delete("/:id", handleDeleteNotification);
router.delete("/", handleDeleteAllNotifications);

export default router;
