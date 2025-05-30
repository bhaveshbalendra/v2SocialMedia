import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { IFollowParameter } from "../types/user.types";
import { io } from "../utils/socket.util";

class ProfileService {
  async getUserProfile(username: string) {
    const user = await User.findOne({ username })
      .populate("followers following", "username profilePicture")
      .populate("posts", "media _id title likes ")
      .lean();

    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    return {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
      posts: user.posts,
      isPrivate: user.isPrivate,
      isBlocked: user.isBlocked,
    };
  }
}

export default new ProfileService();

// import { Types } from "mongoose";
// import { AppError } from "../middleware/error.middleware";
// import User from "../models/user.model";

// class ProfileService {
//   /**
//    * Get user profile by username
//    */
//   async getProfile(username: string, currentUserId?: string) {
//     const user = await User.findOne({ username })
//       .populate("followers following", "username profilePicture")
//       .populate("posts", "media _id title likes")
//       .lean();

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     // Check if current user is blocked
//     if (
//       currentUserId &&
//       user.blockedUsers?.includes(new Types.ObjectId(currentUserId))
//     ) {
//       throw AppError.unauthorizedError("Access denied");
//     }

//     // Check privacy settings
//     if (user.isPrivate && currentUserId !== user._id.toString()) {
//       // Check if current user is following
//       const isFollowing = user.followers?.some(
//         (follower: any) => follower._id.toString() === currentUserId
//       );

//       if (!isFollowing) {
//         return {
//           _id: user._id,
//           username: user.username,
//           profilePicture: user.profilePicture,
//           bio: user.bio,
//           isPrivate: true,
//           followersCount: user.followers?.length || 0,
//           followingCount: user.following?.length || 0,
//           postsCount: user.posts?.length || 0,
//         };
//       }
//     }

//     return {
//       _id: user._id,
//       username: user.username,
//       profilePicture: user.profilePicture,
//       bio: user.bio,
//       location: user.location,
//       followers: user.followers,
//       following: user.following,
//       posts: user.posts,
//       followersCount: user.followers?.length || 0,
//       followingCount: user.following?.length || 0,
//       postsCount: user.posts?.length || 0,
//       isPrivate: user.isPrivate,
//       createdAt: user.createdAt,
//     };
//   }

//   /**
//    * Get current user's own profile
//    */
//   async getMyProfile(userId: string) {
//     const user = await User.findById(userId)
//       .populate("followers following", "username profilePicture")
//       .populate("posts", "media _id title likes")
//       .select("-password")
//       .lean();

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     return {
//       ...user,
//       followersCount: user.followers?.length || 0,
//       followingCount: user.following?.length || 0,
//       postsCount: user.posts?.length || 0,
//     };
//   }

//   /**
//    * Update user profile
//    */
//   async updateProfile(userId: string, updateData: any) {
//     const allowedUpdates = [
//       "username",
//       "bio",
//       "profilePicture",
//       "location",
//       "name",
//     ];
//     const filteredData: any = {};

//     Object.keys(updateData).forEach((key) => {
//       if (allowedUpdates.includes(key)) {
//         filteredData[key] = updateData[key];
//       }
//     });

//     // Check if username is unique (if updating username)
//     if (filteredData.username) {
//       const existingUser = await User.findOne({
//         username: filteredData.username,
//         _id: { $ne: userId },
//       });

//       if (existingUser) {
//         throw AppError.emptyOrInvalidData("Username already taken");
//       }
//     }

//     const user = await User.findByIdAndUpdate(userId, filteredData, {
//       new: true,
//       runValidators: true,
//     }).select("-password");

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     return user;
//   }

//   /**
//    * Search profiles
//    */
//   async searchProfiles(
//     searchTerm: string,
//     currentUserId: string,
//     limit: number
//   ) {
//     if (!searchTerm || searchTerm.trim() === "") {
//       return [];
//     }

//     const users = await User.find({
//       _id: { $ne: currentUserId },
//       blockedUsers: { $ne: currentUserId }, // Exclude users who blocked current user
//       $or: [
//         { username: { $regex: searchTerm, $options: "i" } },
//         { name: { $regex: searchTerm, $options: "i" } },
//       ],
//     })
//       .select("username profilePicture name bio isPrivate")
//       .limit(limit)
//       .lean();

//     return users;
//   }

//   /**
//    * Update privacy settings
//    */
//   async updatePrivacySettings(userId: string, isPrivate: boolean) {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { isPrivate },
//       { new: true }
//     );

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     return { message: `Account is now ${isPrivate ? "private" : "public"}` };
//   }

//   /**
//    * Update profile settings (display preferences)
//    */
//   async updateProfileSettings(userId: string, settings: any) {
//     const allowedSettings = [
//       "showEmail",
//       "showPhone",
//       "showLocation",
//       "showBirthday",
//       "allowTagging",
//       "showOnlineStatus",
//       "allowStoriesReshare",
//       "showActivityStatus",
//       "allowMessageRequests",
//       "profileVisibility", // public, friends, private
//       "whoCanSeeMyPosts", // everyone, followers, nobody
//       "whoCanSeeMyStories", // everyone, followers, close_friends
//       "whoCanTagMe", // everyone, followers, nobody
//       "whoCanMentionMe", // everyone, followers, nobody
//     ];

//     const filteredSettings: any = {};
//     Object.keys(settings).forEach((key) => {
//       if (allowedSettings.includes(key)) {
//         filteredSettings[`profileSettings.${key}`] = settings[key];
//       }
//     });

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: filteredSettings },
//       { new: true, runValidators: true }
//     ).select("profileSettings");

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     return user.profileSettings;
//   }

//   /**
//    * Get profile settings
//    */
//   async getProfileSettings(userId: string) {
//     const user = await User.findById(userId)
//       .select("profileSettings isPrivate")
//       .lean();

//     if (!user) {
//       throw AppError.notFoundError("User not found");
//     }

//     // Default settings if not set
//     const defaultSettings = {
//       showEmail: false,
//       showPhone: false,
//       showLocation: true,
//       showBirthday: false,
//       allowTagging: true,
//       showOnlineStatus: true,
//       allowStoriesReshare: true,
//       showActivityStatus: true,
//       allowMessageRequests: true,
//       profileVisibility: "public",
//       whoCanSeeMyPosts: "everyone",
//       whoCanSeeMyStories: "followers",
//       whoCanTagMe: "everyone",
//       whoCanMentionMe: "everyone",
//       isPrivate: user.isPrivate || false,
//     };

//     return {
//       ...defaultSettings,
//       ...user.profileSettings,
//       isPrivate: user.isPrivate,
//     };
//   }
// }

// export default new ProfileService();
