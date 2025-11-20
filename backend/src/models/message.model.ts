import { Model, model, Schema } from "mongoose";
import { IMessage } from "../types/schema.types";

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    // Message types
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video", "system"],
      default: "text",
    },

    // File/media metadata (for non-text messages)
    media: {
      url: String,
      filename: String,
      size: Number,
      mimeType: String,
    },

    // Message status and metadata
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,

    // Delivery receipts (track when message is delivered to recipient)
    deliveredBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Read receipts (for individual conversations)
    readBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Reply/thread functionality
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    // Reactions
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // System message data (for join/leave notifications and post shares)
    systemData: {
      action: {
        type: String,
        enum: [
          "user_joined",
          "user_left",
          "user_added",
          "user_removed",
          "group_created",
          "group_updated",
          "post_shared",
        ],
      },
      targetUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      metadata: Schema.Types.Mixed, // For additional system message data (e.g., postId for shared posts)
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for delivery status
messageSchema.virtual("isDelivered").get(function () {
  return this.deliveredBy && this.deliveredBy.length > 0;
});

// Virtual for read status in individual conversations
messageSchema.virtual("isRead").get(function () {
  return this.readBy && this.readBy.length > 0;
});

// Index for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

export const Message: Model<IMessage> = model<IMessage>(
  "Message",
  messageSchema
);
