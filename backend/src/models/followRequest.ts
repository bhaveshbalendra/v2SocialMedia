import { Document, model, Model, Schema, Types } from "mongoose";

// Interface for FollowRequest document
export interface IFollowRequest extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

// Interface for FollowRequest model (static methods)
interface IFollowRequestModel extends Model<IFollowRequest> {}

// Schema definition
const followRequestSchema = new Schema<IFollowRequest, IFollowRequestModel>({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
const FollowRequest = model<IFollowRequest, IFollowRequestModel>(
  "FollowRequest",
  followRequestSchema
);

export default FollowRequest;
