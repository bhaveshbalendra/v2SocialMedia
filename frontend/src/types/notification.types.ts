import { User } from "./auth.types";

/**
 * NotificationType Enum
 * Describes all supported notification types in the system.
 */
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

  // Custom/user-generated
  CUSTOM = "CUSTOM",
}

/**
 * EntityModelType
 */
export type EntityModelType =
  | "Post"
  | "Comment"
  | "Message"
  | "FollowRequest"
  | "Conversation"
  | "User"
  | "Subscription";

/**
 * Interface for Notification
 */
export interface INotification {
  _id: string;
  recipient: string | User;
  sender: string | User;
  type: NotificationType;
  entityId: string;
  entityModel: EntityModelType;
  read: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  notifications: INotification[];
}

/**
 * Interface for notifications state in Redux
 */
export interface NotificationsState {
  notifications: INotification[];
  unreadCount: number;
}

/**
 * Interface for socket notification event
 */
export interface SocketNotificationEvent {
  _id: string;
  type: NotificationType;
  sender: string;
  recipient: string;
  content: string;
  entityId: string;
  entityModel: EntityModelType;
  createdAt: string;
}
