import { Types } from "mongoose";
import { AppError } from "../middlewares/error.middleware";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { IFollowParameter } from "../types/user.types";
import { io } from "../utils/socket";

class UserService {
  async follow({ followingId, followerId }: IFollowParameter) {
    if (followerId === followingId) {
      throw AppError.emptyOrInvalidData("You cannot follow yourself.");
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      throw AppError.notFoundError("User not Found");
    }
    const followerDetails = new Types.ObjectId(follower._id);
    if (following.isPrivate) {
      //if already requested
      if (following.followRequest.includes(followerDetails._id)) {
        throw AppError.emptyOrInvalidData("Follow request already sent");
      }

      //Add to followRequest
      following.followRequest.push(followerDetails._id);
      await following.save();

      //todo work on notification

      io.to(following._id.toString()).emit("notification", {
        type: "FOLLOW-REQUEST",
        recipient: followingId.toString(),
        sender: followerId.toString(),
      });
    }
  }
}
