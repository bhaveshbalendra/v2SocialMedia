import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import Post from "../models/post.model";
import User from "../models/user.model";
import { PostVisibility } from "../types/schema.types";
import { Settings } from "../types/settings.types";

interface UpdateNotificationsParams {
  email?: boolean;
  push?: boolean;
}

interface UpdateProfileParams {
  username?: string;
  email?: string;
  password?: string;
}

// Get user settings
export const getUserSettings = async (
  userId: Types.ObjectId
): Promise<Settings> => {
  // Get user from the database
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.invalidCredentialsError();
  }

  // Construct and return settings object
  return {
    profile: {
      username: user.username,
      email: user.email,
      password: "", // Don't return actual password
      isPremium: user.isPremium || false,
    },
    privacyAndSecurity: {
      isPrivate: user.isPrivate || false,
    },
    notifications: {
      email: user.notificationSettings?.emailNotifications ?? true,
      push: user.notificationSettings?.pushNotifications ?? true,
    },
    accountManagement: {
      user: user._id.toString(),
    },
    connectedAppsAndIntegrations: {
      thirdPartyAppConnection: "",
    },
    paymentAndBilling: {
      history: [],
    },
  };
};

// Update privacy settings
export const updatePrivacy = async (
  userId: Types.ObjectId,
  isPrivate: boolean
): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.invalidCredentialsError();
  }

  if (user.isPrivate === true) {
    const posts = await Post.find({ author: userId });
    await Promise.all(
      posts.map(async (post) => {
        if (post) {
          post.visibility = PostVisibility.Public;
          await post.save();
        }
      })
    );

    await User.findByIdAndUpdate(userId, { isPrivate: false });
  } else {
    const posts = await Post.find({ author: userId });
    await Promise.all(
      posts.map(async (post) => {
        if (post) {
          post.visibility = PostVisibility.Private;
          await post.save();
        }
      })
    );

    user.isPrivate = true;
    await user.save();
  }
  return;
};

// Update notification settings
export const updateNotifications = async (
  userId: string,
  params: UpdateNotificationsParams
): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Initialize notificationSettings if it doesn't exist
  if (!user.notificationSettings) {
    user.notificationSettings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    };
  }

  // Update only the provided fields
  if (params.email !== undefined) {
    user.notificationSettings.emailNotifications = params.email;
  }

  if (params.push !== undefined) {
    user.notificationSettings.pushNotifications = params.push;
  }

  await user.save();
};

// Update profile settings
export const updateProfile = async (
  userId: string,
  params: UpdateProfileParams
): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update username if provided
  if (params.username) {
    // Check if username is already taken
    const existingUser = await User.findOne({ username: params.username });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Username is already taken");
    }
    user.username = params.username;
  }

  // Update email if provided
  if (params.email) {
    // Check if email is already taken
    const existingUser = await User.findOne({ email: params.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Email is already in use");
    }
    user.email = params.email;
  }

  await user.save();
};

// Update premium status
export const updatePremiumStatus = async (
  userId: string,
  isPremium: boolean
): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isPremium = isPremium;

  await user.save();
};
