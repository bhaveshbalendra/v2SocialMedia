import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as settingsService from "../service/settings.service";

/**
 * Get user settings
 * @route GET /api/settings
 */
export const getUserSettings = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const settings = await settingsService.getUserSettings(userId);

    return res.status(200).json({
      success: true,
      settings,
      message: "User settings fetched successfully",
    });
  }
);

/**
 * Update privacy settings
 * @route PATCH /api/settings/privacy
 */
export const updatePrivacy = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id;
    const { isPrivate } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (typeof isPrivate !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid privacy setting",
      });
    }

    await settingsService.updatePrivacy(userId, isPrivate);

    return res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
    });
  }
);

/**
 * Update notification settings
 * @route PATCH /api/settings/notifications
 */
export const updateNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { email, push } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (
      (email !== undefined && typeof email !== "boolean") ||
      (push !== undefined && typeof push !== "boolean")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification settings",
      });
    }

    await settingsService.updateNotifications(userId, { email, push });

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notification settings",
    });
  }
};

/**
 * Update profile settings
 * @route PATCH /api/settings/profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { username, email, password } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await settingsService.updateProfile(userId, {
      username,
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

/**
 * Update premium status
 * @route PATCH /api/settings/premium
 */
export const updatePremiumStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { isPremium } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (typeof isPremium !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid premium status",
      });
    }

    await settingsService.updatePremiumStatus(userId, isPremium);

    return res.status(200).json({
      success: true,
      message: isPremium
        ? "Account upgraded to premium successfully"
        : "Premium subscription cancelled successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update premium status",
    });
  }
};
