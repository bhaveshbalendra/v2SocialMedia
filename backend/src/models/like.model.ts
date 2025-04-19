import { Document, model, Model, Schema } from "mongoose";
export interface ILike extends Document {
  user: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like must belong to a user"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

const Like: Model<ILike> = model<ILike>("Like", likeSchema);
export default Like;
