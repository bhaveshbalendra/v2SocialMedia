import { Document, Types } from "mongoose";

//Interface for User
export interface IUser extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  followRequest: Types.ObjectId[];
  posts: Types.ObjectId[];
  notification: Types.ObjectId[];
  mobileNumber?: string;
  bio?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  location: {
    type: string;
    coordinates: number[];
    city: string;
    country: string;
    state: string;
    zip: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  blockedUsers: Types.ObjectId[];
  socialLinks: {
    instagram: string;
    x: string;
    facebook: string;
    youtube: string;
    github: string;
    linkedin: string;
  };
  gender: string;
  website: string;
  isVerified: boolean;
  isPrivate: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  mobileVerificationToken?: string;
  mobileVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  googleId?: string;
  // facebookId?: string;
  // githubId?: string;
  twitterId?: string;
}

// Enum for better type safety (optional but recommended)
export enum PostVisibility {
  Public = "public",
  Private = "private",
}

// Interface for TypeScript type checking
export interface IPost extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  caption?: string;
  description?: string;
  media: {
    url: string;
    type: "image" | "video";
    publicId: string;
  }[];
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  location?: string;
  tags?: string[];
  visibility: PostVisibility;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  isReported: boolean;
}

//interface for comment
export interface IComment extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  likesCount: number;
  parentComment?: Types.ObjectId;
}

// Interface for FollowRequest document
export interface IFollowRequest extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  type: "individual" | "group";
  groupName?: string;
  groupDescription?: string;
  groupAvatar?: string;
  groupAdmins: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastActivity: Date;
  isActive: boolean;
  settings: {
    muteNotifications: boolean;
    allowNewMembers: boolean;
  };
  // Virtuals
  isGroup: boolean;
  participantCount: number;
}

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  conversationId: Types.ObjectId;
  content: string;
  messageType: "text" | "image" | "file" | "audio" | "video" | "system";
  media?: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
  isEdited: boolean;
  editedAt?: Date;
  deliveredBy: Array<{
    userId: Types.ObjectId;
    deliveredAt: Date;
  }>;
  readBy: Array<{
    userId: Types.ObjectId;
    readAt: Date;
  }>;
  replyTo?: Types.ObjectId;
  reactions: Array<{
    userId: Types.ObjectId;
    emoji: string;
    createdAt: Date;
  }>;
  systemData?: {
    action:
      | "user_joined"
      | "user_left"
      | "user_added"
      | "user_removed"
      | "group_created"
      | "group_updated"
      | "post_shared";
    targetUserId?: Types.ObjectId;
    metadata?: Record<string, unknown>;
  };
  // Virtuals
  isDelivered: boolean;
  isRead: boolean;
}
