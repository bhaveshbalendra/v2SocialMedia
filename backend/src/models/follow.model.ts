import { model, Schema } from "mongoose";

interface IFollow {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  follower: Schema.Types.ObjectId;
  following: Schema.Types.ObjectId;
}

const FollowSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Follow = model<IFollow>("follow", FollowSchema);

export default Follow;
