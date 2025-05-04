import { Document, Model, model, Schema } from "mongoose";

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
  likesCount: number;
  location?: string;
  tags?: string[];
  title: string;
  visibility: string;
  description: string;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  isReported: boolean;
}

const postSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      trim: true,
      maxLength: [40, "Caption must be at most 50 characters long"],
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    media: [
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
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    likesCount: {
      type: Number,
      default: 0,
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
  { timestamps: true }
);

const Post: Model<IPost> = model<IPost>("Post", postSchema);
export default Post;
