import { Model, model, Schema } from "mongoose";
import { IConversation } from "../types/schema.types";

const conversationSchema: Schema<IConversation> = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    // Conversation type and metadata
    type: {
      type: String,
      enum: ["individual", "group"],
      required: true,
    },

    // Group-specific fields (only used when type is 'group')
    groupName: {
      type: String,
      required: function () {
        return this.type === "group";
      },
    },
    groupDescription: {
      type: String,
      default: "",
    },
    groupAvatar: {
      type: String, // URL to group image
      default: "",
    },
    groupAdmins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // General conversation metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },

    // Privacy and settings
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      muteNotifications: {
        type: Boolean,
        default: false,
      },
      allowNewMembers: {
        type: Boolean,
        default: true, // Only relevant for groups
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if conversation is group
conversationSchema.virtual("isGroup").get(function () {
  return this.type === "group";
});

// Virtual for participant count
conversationSchema.virtual("participantCount").get(function () {
  return this.participants.length;
});

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1 });
conversationSchema.index({ lastActivity: -1 });

export const Conversation: Model<IConversation> = model<IConversation>(
  "Conversation",
  conversationSchema
);
