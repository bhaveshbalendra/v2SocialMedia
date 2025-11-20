import { Model, model, Schema } from "mongoose";
import { INotification } from "../types/notification.types";

// Notification Schema - Mongoose schema for user notifications
const notificationSchema: Schema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        // Social interactions
        "FOLLOW_REQUEST", // Someone sent you a follow request
        "FOLLOW_ACCEPTED", // Your follow request was accepted
        "FOLLOWED", // Someone started following you

        // Content interactions
        "POST_CREATED", // Someone you follow created a post
        "POST_LIKED", // Someone liked your post
        "POST_COMMENTED", // Someone commented on your post
        "POST_SHARED", // Someone shared your post
        "COMMENT_LIKED", // Someone liked your comment
        "COMMENT_REPLIED", // Someone replied to your comment

        // Messaging
        "MESSAGE_RECEIVED", // You received a direct message

        // Mentions and tags
        "USER_MENTIONED", // You were mentioned in a post or comment
        "TAGGED_IN_POST", // You were tagged in a post

        // System and admin
        "SYSTEM_ALERT", // System notification (maintenance, update, etc.)
        "ADMIN_ANNOUNCEMENT", // Admin or system-wide announcement

        // Engagement and reminders
        "FRIEND_JOINED", // A contact or friend joined the platform
        "EVENT_REMINDER", // Reminder for an event
        "PROMOTION", // Promotional or marketing notification

        // Transactional
        "TRANSACTION_SUCCESS", // Payment or transaction succeeded
        "TRANSACTION_FAILED", // Payment or transaction failed

        // Account and security
        "ACCOUNT_VERIFIED", // Account/email/phone verified
        "ACCOUNT_SUSPENDED", // Account suspended or blocked
        "PASSWORD_CHANGED", // Password was changed

        // Custom/user-generated
        "CUSTOM", // For custom or future notification types
      ],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      required: true,
      enum: [
        "Post",
        "Comment",
        "Message",
        "FollowRequest",
        "Conversation",
        "User",
        "Subscription",
      ],
    },
    read: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster notification lookups
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });

const Notification: Model<INotification> = model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
