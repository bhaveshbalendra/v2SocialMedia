import { Document, Types } from "mongoose";

// NotificationType Enum - describes all supported notification types in the system
export enum NotificationType {
  // Social interactions
  FOLLOW_REQUEST = "FOLLOW_REQUEST",
  FOLLOW_ACCEPTED = "FOLLOW_ACCEPTED",
  FOLLOWED = "FOLLOWED",

  // Content interactions
  POST_CREATED = "POST_CREATED",
  POST_LIKED = "POST_LIKED",
  POST_COMMENTED = "POST_COMMENTED",
  POST_SHARED = "POST_SHARED",
  COMMENT_LIKED = "COMMENT_LIKED",
  COMMENT_REPLIED = "COMMENT_REPLIED",

  // Messaging
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",

  // Mentions and tags
  USER_MENTIONED = "USER_MENTIONED",
  TAGGED_IN_POST = "TAGGED_IN_POST",

  // System and admin
  SYSTEM_ALERT = "SYSTEM_ALERT",
  ADMIN_ANNOUNCEMENT = "ADMIN_ANNOUNCEMENT",

  // Engagement and reminders
  FRIEND_JOINED = "FRIEND_JOINED",
  EVENT_REMINDER = "EVENT_REMINDER",
  PROMOTION = "PROMOTION",
  REENGAGEMENT = "REENGAGEMENT",

  // Transactional
  TRANSACTION_SUCCESS = "TRANSACTION_SUCCESS",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
  ORDER_SHIPPED = "ORDER_SHIPPED",
  ORDER_DELIVERED = "ORDER_DELIVERED",

  // Account and security
  ACCOUNT_VERIFIED = "ACCOUNT_VERIFIED",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  PASSWORD_CHANGED = "PASSWORD_CHANGED",
  LOGIN_ALERT = "LOGIN_ALERT",

  // Custom/user-generated
  CUSTOM = "CUSTOM",
}

// EntityModelType Enum
export type EntityModelType =
  | "Post"
  | "Comment"
  | "Message"
  | "FollowRequest"
  | "Conversation"
  | "User"
  | "Subscription";

// Interface for Notification Document
export interface INotification extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  recipient: Types.ObjectId | string;
  sender: Types.ObjectId | string;
  type: NotificationType;
  entityId: Types.ObjectId | string;
  entityModel: EntityModelType;
  read: boolean;
  content: string;
}

// Interface for populated notification with entity data
export interface IPopulatedNotification
  extends Omit<INotification, "entityId"> {
  entityData?: unknown; // The populated entity data based on entityModel
}

// Interface for creating a notification
export interface CreateNotificationParams {
  sender: string | Types.ObjectId;
  recipient: string | Types.ObjectId;
  type: NotificationType;
  content: string;
  entityId: string | Types.ObjectId;
  entityModel: EntityModelType;
}

// Interface for the helper createNotification method
export interface CreateNotificationHelperParams {
  sender: string | Types.ObjectId;
  recipient: string | Types.ObjectId;
  type: NotificationType;
  content?: string;
  post?: string | Types.ObjectId;
  comment?: string | Types.ObjectId;
  message?: string | Types.ObjectId;
  followRequest?: string | Types.ObjectId;
}
