import { Document, Model, model, Schema } from "mongoose";

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
  caption?: string;
  media: {
    url: string;
    type: "image" | "video";
    publicId: string;
  }[];
  author: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  location?: string;
  tags?: string[];
  title: string;
  visibility: PostVisibility;
  description: string;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  isReported: boolean;
}

/**
 * @description Post schema with validation and best practices
 */
const postSchema: Schema<IPost> = new Schema<IPost>(
  {
    title: {
      type: String,
      trim: true,
      maxLength: [40, "Title must be at most 40 characters long"],
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [100, "Caption must be at most 100 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters long"],
    },
    tags: {
      type: [String],
      trim: true,
      default: [],
    },
    media: {
      type: [
        {
          url: {
            type: String,
            required: [true, "Media URL is required"],
          },
          type: {
            type: String,
            enum: ["image", "video"],
            required: [true, "Media type is required"],
          },
          publicId: {
            type: String,
            required: [true, "Public ID is required"],
          },
        },
      ],
      default: [],
    },
    visibility: {
      type: String,
      enum: Object.values(PostVisibility),
      default: PostVisibility.Public,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 }); // For user's posts feed
postSchema.index({ visibility: 1, isArchived: 1, isDeleted: 1 }); // For public post queries

// Export model
const Post: Model<IPost> = model<IPost>("Post", postSchema);
export default Post;
