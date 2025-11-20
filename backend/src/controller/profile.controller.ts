import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import profileService from "../service/profile.service";

// Get user profile by username
const handleGetUserProfile = asyncHandler(
  async (request: Request, response: Response) => {
    const { username } = request.params;
    const user = await profileService.getUserProfile(username);
    response
      .status(200)
      .json({ success: true, message: "User profile fetched", user });
  }
);

// Search profiles by username or name
const handleSearchProfiles = asyncHandler(
  async (request: Request, response: Response) => {
    const { q: searchTerm } = request.query;

    const profiles = await profileService.searchProfiles(searchTerm as string);

    response.status(200).json({
      success: true,
      profiles,
    });
  }
);

export { handleGetUserProfile, handleSearchProfiles };
