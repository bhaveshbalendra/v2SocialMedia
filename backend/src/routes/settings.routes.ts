import { Router } from "express";
import {
  handleGetUserSettings,
  handleUpdateNotifications,
  handleUpdatePremiumStatus,
  handleUpdatePrivacy,
  handleUpdateProfile,
} from "../controller/settings.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Apply authentication middleware to all settings routes
router.use(authenticate);

// Get user settings
router.get("/", handleGetUserSettings);

// Update privacy settings
router.patch("/privacy", handleUpdatePrivacy);

// Update notification settings
router.patch("/notifications", handleUpdateNotifications);

// Update profile settings
router.patch("/profile", handleUpdateProfile);

// Update premium status
router.patch("/premium", handleUpdatePremiumStatus);

export default router;
