import { Document, model, Model, Schema } from "mongoose";
export interface ILike extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  user: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
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
