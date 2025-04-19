import { Document, Model, model, Schema } from "mongoose";

export interface IBookmark extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bookmark must belong to a user"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Bookmark must reference a post"],
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark: Model<IBookmark> = model<IBookmark>("Bookmark", bookmarkSchema);
export default Bookmark;
