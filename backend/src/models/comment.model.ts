import { Document, Model, Schema, model } from "mongoose";

//interface for comment
export interface IComment extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  likesCount: number;
  parentComment?: Schema.Types.ObjectId;
}

/**
 * @description comment schema
 */
const commentSchema: Schema<IComment> = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: {
      type: Number,
      default: 0,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//model for comment
const Comment: Model<IComment> = model<IComment>("comment", commentSchema);
export default Comment;
