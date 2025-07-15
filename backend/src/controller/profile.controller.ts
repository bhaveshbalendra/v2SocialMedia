import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import profileService from "../service/profile.service";

const handleGetUserProfile = asyncHandler(
  async (request: Request, response: Response) => {
    const { username } = request.params;
    const user = await profileService.getUserProfile(username);
    response
      .status(200)
      .json({ success: true, message: "User profile fetched", user });
  }
);

// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import profileService from "../service/profile.service";

// /**
//  * @desc    Get user profile by username
//  * @route   GET /api/profiles/:username
//  * @access  Public/Private (depends on privacy settings)
//  */
// const handleGetProfile = asyncHandler(
//   async (request: Request, response: Response) => {
//     const { username } = request.params;
//     const currentUserId = request.user?._id?.toString();

//     const profile = await profileService.getProfile(username, currentUserId);

//     response.status(200).json({
//       success: true,
//       message: "Profile fetched successfully",
//       data: profile,
//     });
//   }
// );

// /**
//  * @desc    Update current user's profile
//  * @route   PUT /api/profiles/me
//  * @access  Private
//  */
// const handleUpdateMyProfile = asyncHandler(
//   async (request: Request, response: Response) => {
//     const userId = request.user!._id.toString();
//     const updateData = request.body;

//     const updatedProfile = await profileService.updateProfile(
//       userId,
//       updateData
//     );

//     response.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedProfile,
//     });
//   }
// );

// /**
//  * @desc    Get current user's profile
//  * @route   GET /api/profiles/me
//  * @access  Private
//  */
// const handleGetMyProfile = asyncHandler(
//   async (request: Request, response: Response) => {
//     const userId = request.user!._id.toString();

//     const profile = await profileService.getMyProfile(userId);

//     response.status(200).json({
//       success: true,
//       message: "Your profile fetched successfully",
//       data: profile,
//     });
//   }
// );

/**
 * @desc    Search profiles
 * @route   GET /api/profiles/search?q=searchTerm
 * @access  Private
 */
const handleSearchProfiles = asyncHandler(
  async (request: Request, response: Response) => {
    const { q: searchTerm } = request.query;
    console.log("search", searchTerm);

    const profiles = await profileService.searchProfiles(searchTerm as string);

    response.status(200).json({
      success: true,
      profiles,
    });
  }
);

// /**
//  * @desc    Update privacy settings
//  * @route   PATCH /api/profiles/privacy
//  * @access  Private
//  */
// const handleUpdatePrivacy = asyncHandler(
//   async (request: Request, response: Response) => {
//     const userId = request.user!._id.toString();
//     const { isPrivate } = request.body;

//     const result = await profileService.updatePrivacySettings(
//       userId,
//       isPrivate
//     );

//     response.status(200).json({
//       success: true,
//       message: result.message,
//     });
//   }
// );

// /**
//  * @desc    Update profile settings (display preferences)
//  * @route   PATCH /api/profiles/settings
//  * @access  Private
//  */
// const handleUpdateProfileSettings = asyncHandler(
//   async (request: Request, response: Response) => {
//     const userId = request.user!._id.toString();
//     const settings = request.body;

//     const result = await profileService.updateProfileSettings(userId, settings);

//     response.status(200).json({
//       success: true,
//       message: "Profile settings updated successfully",
//       data: result,
//     });
//   }
// );

// /**
//  * @desc    Get profile settings
//  * @route   GET /api/profiles/settings
//  * @access  Private
//  */
// const handleGetProfileSettings = asyncHandler(
//   async (request: Request, response: Response) => {
//     const userId = request.user!._id.toString();

//     const settings = await profileService.getProfileSettings(userId);

//     response.status(200).json({
//       success: true,
//       data: settings,
//     });
//   }
// );

export {
  handleGetUserProfile,
  // handleGetMyProfile,
  // handleGetProfile,
  // handleGetProfileSettings,
  handleSearchProfiles,
};
