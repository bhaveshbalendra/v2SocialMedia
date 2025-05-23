import { model, Model, Schema } from "mongoose";
import { IFollowRequest } from "../types/schema.types";

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
