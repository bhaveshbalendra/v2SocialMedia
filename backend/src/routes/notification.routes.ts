import { Router } from "express";
import notificationController from "../controller/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Require authentication for all notification routes
router.use(authenticate);

// Get all notifications
router.get("/", notificationController.getNotifications);

// Get unread notification count
router.get("/unread-count", notificationController.getUnreadCount);

// Mark notifications as read
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);

// Delete a notification
router.delete("/:id", notificationController.deleteNotification);

export default router;
