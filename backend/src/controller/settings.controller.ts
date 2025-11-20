import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as settingsService from "../service/settings.service";

// Get user settings
const handleGetUserSettings = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id;

    const settings = await settingsService.getUserSettings(userId);

    response.status(200).json({
      success: true,
      message: "User settings fetched successfully",
      settings,
    });
  }
);

// Update privacy settings
const handleUpdatePrivacy = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id;
    const { isPrivate } = request.body;

    if (typeof isPrivate !== "boolean") {
      response.status(400).json({
        success: false,
        message: "Invalid privacy setting",
      });
      return;
    }

    await settingsService.updatePrivacy(userId, isPrivate);

    response.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
    });
  }
);

// Update notification settings
const handleUpdateNotifications = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const { email, push } = request.body;

    if (
      (email !== undefined && typeof email !== "boolean") ||
      (push !== undefined && typeof push !== "boolean")
    ) {
      response.status(400).json({
        success: false,
        message: "Invalid notification settings",
      });
      return;
    }

    await settingsService.updateNotifications(userId, { email, push });

    response.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
    });
  }
);

// Update profile settings
const handleUpdateProfile = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const { username, email, password } = request.body;

    await settingsService.updateProfile(userId, {
      username,
      email,
      password,
    });

    response.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  }
);

// Update premium status
const handleUpdatePremiumStatus = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const { isPremium } = request.body;

    if (typeof isPremium !== "boolean") {
      response.status(400).json({
        success: false,
        message: "Invalid premium status",
      });
      return;
    }

    await settingsService.updatePremiumStatus(userId, isPremium);

    response.status(200).json({
      success: true,
      message: isPremium
        ? "Account upgraded to premium successfully"
        : "Premium subscription cancelled successfully",
    });
  }
);

export {
  handleGetUserSettings,
  handleUpdateNotifications,
  handleUpdatePremiumStatus,
  handleUpdatePrivacy,
  handleUpdateProfile,
};
