import { Router } from "express";
import * as settingsController from "../controller/settings.controller";
import { getUserSettings } from "../controller/settings.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Apply authentication middleware to all settings routes
router.use(authenticate);

// Get user settings
router.get("/", getUserSettings);

// Update privacy settings
router.patch("/privacy", settingsController.updatePrivacy);

// // Update notification settings
// router.patch("/notifications", settingsController.updateNotifications);

// // Update profile settings
// router.patch("/profile", settingsController.updateProfile);

// // Update premium status
// router.patch("/premium", settingsController.updatePremiumStatus);

export default router;
