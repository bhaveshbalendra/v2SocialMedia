import { Types } from "mongoose";
import { config } from "../config/app.config";
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

  // Search profiles
  async searchProfiles(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .select("username profilePicture firstName lastName")
      .limit(config.search_limit)
      .lean();

    return users;
  }
}

export default new ProfileService();
