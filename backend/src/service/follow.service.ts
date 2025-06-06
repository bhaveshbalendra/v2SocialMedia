import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import FollowRequest from "../models/followRequest";
import User from "../models/user.model";
import {
  IFollowServiceParameter,
  IFollowServiceReturn,
} from "../types/follow.types";
import { NotificationType } from "../types/notification.types";
import { io, userSocketMap } from "../utils/socket.util";
import notificationService from "./notification.service";

/**
 * Follow status enum for the frontend response
 */
export enum FollowStatusCheck {
  FOLLOWING = "following",
  NOT_FOLLOWING = "not_following",
  REQUESTED = "requested",
  PRIVATE = "private",
}

class FollowService {
  /**
   * Send a follow request or follow a user directly based on privacy settings
   */
  async follow({
    followingUserName,
    followerId,
  }: IFollowServiceParameter): Promise<IFollowServiceReturn> {
    const following = await User.findOne({ username: followingUserName });

    if (!following) {
      throw AppError.notFoundError("User not found");
    }

    // Validate input
    if (followerId === following._id.toString()) {
      throw AppError.emptyOrInvalidData("You cannot follow yourself.");
    }

    // Find both users
    const follower = await User.findById(followerId);

    if (!follower || !following) {
      throw AppError.notFoundError("User not found");
    }

    // Check if already following
    if (following.followers.includes(new Types.ObjectId(followerId))) {
      throw AppError.emptyOrInvalidData("Already following this user");
    }

    // Check if user is blocked
    if (following.blockedUsers.includes(new Types.ObjectId(followerId))) {
      throw AppError.emptyOrInvalidData("You cannot follow this user");
    }

    const followerObjectId = new Types.ObjectId(followerId);
    const followingId = new Types.ObjectId(following._id);

    // Handle based on privacy settings
    if (following.isPrivate) {
      // Check if already requested
      if (following.followRequest.includes(followerObjectId)) {
        throw AppError.emptyOrInvalidData("Follow request already sent");
      }

      // Create follow request in separate collection
      const newRequest = await FollowRequest.create({
        from: followerId,
        to: followingId,
        status: "pending",
      });

      if (!newRequest) {
        throw AppError.emptyOrInvalidData("Failed to create follow request");
      }

      const newRequestObjectId = new Types.ObjectId(
        newRequest._id as Types.ObjectId
      );

      // Add to followRequest array
      following.followRequest.push(followerObjectId);
      await following.save();

      // Create notification for follow request
      await notificationService.createNotification({
        sender: followerId,
        recipient: followingId,
        type: NotificationType.FOLLOW_REQUEST,
        content: notificationService.generateContent(
          NotificationType.FOLLOW_REQUEST,
          follower.username
        ),
        entityId: newRequestObjectId,
        entityModel: "FollowRequest",
      });

      const followingSockets = userSocketMap.get(followingId.toString());

      if (followingSockets && followingSockets.length > 0) {
        followingSockets.forEach((socketId) => {
          // Emit socket event
          io.to(socketId).emit("followRequest", {
            type: "FOLLOW_REQUEST",
            recipient: followingId.toString(),
            sender: followerId.toString(),
            senderUsername: follower.username,
          });
        });
      }

      return { message: "Follow request sent" };
    } else {
      // Public account - direct follow
      return this.directFollow(followerId, followingId.toString());
    }
  }

  /**
   * Direct follow for public accounts
   */
  async directFollow(followerId: string, followingId: string) {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      throw AppError.notFoundError("User not found");
    }

    // Update following's followers list
    following.followers.push(new Types.ObjectId(followerId));
    await following.save();

    // Update follower's following list
    follower.following.push(new Types.ObjectId(followingId));
    await follower.save();

    // Create notification
    await notificationService.createNotification({
      sender: followerId,
      recipient: followingId,
      type: NotificationType.FOLLOWED,
      content: notificationService.generateContent(
        NotificationType.FOLLOWED,
        follower.username
      ),
      entityId: new Types.ObjectId(followerId),
      entityModel: "User",
    });

    return { message: "Successfully followed user" };
  }

  /**
   * Accept a follow request
   */
  async acceptFollowRequest(requestId: string, userId: string) {
    console.log(requestId, userId);
    // Find the request
    const requestIdObject = new Types.ObjectId(requestId);
    const request = await FollowRequest.findById(requestIdObject);
    console.log(request);
    if (!request) {
      throw AppError.notFoundError("Follow request not found");
    }

    // Verify this request is for the current user
    if (request.to.toString() !== userId) {
      throw AppError.unauthorizedError("Not authorized to accept this request");
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      throw AppError.emptyOrInvalidData(`Request already ${request.status}`);
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Add follower-following relationship
    await this.directFollow(request.from.toString(), request.to.toString());

    // Remove from followRequest array
    await User.findByIdAndUpdate(userId, {
      $pull: { followRequest: request.from },
    });

    // Get follower details for notification
    const follower = await User.findById(request.from);
    if (!follower) {
      throw AppError.notFoundError("Requester not found");
    }

    // Create notification for requester
    await notificationService.createNotification({
      sender: userId,
      recipient: request.from.toString(),
      type: NotificationType.FOLLOW_ACCEPTED,
      content: notificationService.generateContent(
        NotificationType.FOLLOW_ACCEPTED,
        follower.username
      ),
      entityId: request._id as string,
      entityModel: "FollowRequest",
    });

    // Emit socket event
    io.to(request.from.toString()).emit("followAccepted", {
      type: "FOLLOW_ACCEPTED",
      recipient: request.from.toString(),
      sender: userId,
    });

    return { message: "Follow request accepted" };
  }

  /**
   * Reject a follow request
   */
  async rejectFollowRequest(requestId: string, userId: string) {
    // Find the request
    const request = await FollowRequest.findById(requestId);
    if (!request) {
      throw AppError.notFoundError("Follow request not found");
    }

    // Verify this request is for the current user
    if (request.to.toString() !== userId) {
      throw AppError.unauthorizedError("Not authorized to reject this request");
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      throw AppError.emptyOrInvalidData(`Request already ${request.status}`);
    }

    // Update request status
    request.status = "rejected";
    await request.save();

    // Remove from followRequest array
    await User.findByIdAndUpdate(userId, {
      $pull: { followRequest: request.from },
    });

    return { message: "Follow request rejected" };
  }

  /**
   * Unfollow a user
   */
  async unfollow(followingId: string, followerId: string) {
    if (followerId === followingId) {
      throw AppError.emptyOrInvalidData("You cannot unfollow yourself.");
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      throw AppError.notFoundError("User not found");
    }

    // Check if actually following
    if (!following.followers.includes(new Types.ObjectId(followerId))) {
      throw AppError.emptyOrInvalidData("You are not following this user");
    }

    // Remove from followers list
    await User.findByIdAndUpdate(followingId, {
      $pull: { followers: followerId },
    });

    // Remove from following list
    await User.findByIdAndUpdate(followerId, {
      $pull: { following: followingId },
    });

    return { message: "Successfully unfollowed user" };
  }

  /**
   * Get follow requests for a user
   */
  async getFollowRequests(userId: string) {
    const requests = await FollowRequest.find({
      to: userId,
      status: "pending",
    }).populate("from", "username profilePicture");

    return requests;
  }

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string) {
    const user = await User.findById(userId)
      .populate("followers", "username profilePicture")
      .lean();

    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    return user.followers;
  }

  /**
   * Get users followed by a user
   */
  async getFollowing(userId: string) {
    const user = await User.findById(userId)
      .populate("following", "username profilePicture")
      .lean();

    if (!user) {
      throw AppError.notFoundError("User not found");
    }

    return user.following;
  }

  /**
   * Check the follow status between two users
   */
  async checkFollowStatus(currentUserId: string, targetUserId: string) {
    try {
      // Check if users exist
      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId),
      ]);

      if (!currentUser || !targetUser) {
        throw AppError.notFoundError("User not found");
      }

      // If current user is already following target user
      if (targetUser.followers.includes(new Types.ObjectId(currentUserId))) {
        return { status: FollowStatusCheck.FOLLOWING };
      }

      // If target user is private
      if (targetUser.isPrivate) {
        // Check if there's a pending request
        const pendingRequest = await FollowRequest.findOne({
          from: currentUserId,
          to: targetUserId,
          status: "pending",
        });

        if (pendingRequest) {
          return { status: FollowStatusCheck.REQUESTED };
        }

        return { status: FollowStatusCheck.PRIVATE };
      }

      // Default case - not following and can follow
      return { status: FollowStatusCheck.NOT_FOLLOWING };
    } catch (error) {
      console.error("Error checking follow status:", error);
      throw error;
    }
  }

  /**
   * Get suggested users to follow based on various algorithms
   * - Users followed by users you follow (2nd degree connections)
   * - Users with similar interests (based on post tags)
   * - New and active users
   */
  async getSuggestedUsers(userId: string, limit: number = 5) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw AppError.notFoundError("User not found");
      }

      // Get users that the current user is already following
      const followingIds = user.following.map((id) => id.toString());
      followingIds.push(userId); // Add current user to exclude them

      // Get users followed by users you follow (2nd degree connections)
      // This is a simple implementation - in production you'd want to optimize this query
      const suggestions = await User.aggregate([
        // Match users who are followed by people the current user follows
        {
          $match: {
            followers: { $in: user.following },
            _id: { $nin: followingIds.map((id) => new Types.ObjectId(id)) },
          },
        },
        // Randomly select users to add variety
        { $sample: { size: limit } },
        // Project only needed fields
        {
          $project: {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            bio: 1,
            isVerified: 1,
          },
        },
      ]);

      // If we don't have enough suggestions, add some new users
      if (suggestions.length < limit) {
        const additionalUsers = await User.find({
          _id: { $nin: [...followingIds, ...suggestions.map((u) => u._id)] },
        })
          .sort({ createdAt: -1 }) // New users first
          .limit(limit - suggestions.length)
          .select(
            "_id username firstName lastName profilePicture bio isVerified"
          );

        suggestions.push(...additionalUsers);
      }

      return suggestions;
    } catch (error) {
      console.error("Error getting suggested users:", error);
      throw error;
    }
  }

  /**
   * Get mutual followers between two users
   */
  async getMutualFollowers(
    currentUserId: string,
    targetUserId: string,
    limit: number = 10
  ) {
    try {
      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId),
      ]);

      if (!currentUser || !targetUser) {
        throw AppError.notFoundError("User not found");
      }

      // Convert ObjectId to strings for comparison
      const currentUserFollowing = currentUser.following.map((id) =>
        id.toString()
      );
      const targetUserFollowers = targetUser.followers.map((id) =>
        id.toString()
      );

      // Find the intersection (mutual connections)
      const mutualIds = currentUserFollowing.filter((id) =>
        targetUserFollowers.includes(id)
      );

      // Get the mutual users' details
      const mutualUsers = await User.find({
        _id: { $in: mutualIds },
      })
        .limit(limit)
        .select("_id username firstName lastName profilePicture isVerified");

      return mutualUsers;
    } catch (error) {
      console.error("Error getting mutual followers:", error);
      throw error;
    }
  }
}

export default new FollowService();
