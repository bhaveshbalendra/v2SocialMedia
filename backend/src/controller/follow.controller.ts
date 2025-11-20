import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import User from "../models/user.model";
import { AppError } from "../middleware/error.middleware";
import followService from "../service/follow.service";

// Follow a user or send follow request
const handleFollow = asyncHandler(
  async (request: Request, response: Response) => {
    const followerId = request.user._id.toString();
    const followingUserName = request.params.userId; // User to follow

    const result = await followService.follow({
      followerId: followerId.toString(),
      followingUserName,
    });

    response.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

// Unfollow a user
const handleUnfollow = asyncHandler(
  async (request: Request, response: Response) => {
    const followerId = request.user._id.toString();
    const followingIdentifier = request.params.userId; // Can be username or userId

    // Try to find user by username or ID
    let following;
    // Check if it's a valid ObjectId
    if (Types.ObjectId.isValid(followingIdentifier)) {
      following = await User.findById(followingIdentifier);
    }
    // If not found or not valid ObjectId, try as username
    if (!following) {
      following = await User.findOne({ username: followingIdentifier });
    }

    if (!following) {
      throw AppError.notFoundError("User not found");
    }

    const result = await followService.unfollow(following._id.toString(), followerId);

    response.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

// Get pending follow requests for the current user
const handleGetFollowRequests = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    const requests = await followService.getFollowRequests(userId);

    response.status(200).json({
      success: true,
      data: requests,
    });
  }
);

// Accept a follow request
const handleAcceptFollowRequest = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const requestId = request.params.requestId;

    const result = await followService.acceptFollowRequest(requestId, userId);

    response.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

// Reject a follow request
const handleRejectFollowRequest = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const requestId = request.params.requestId;

    const result = await followService.rejectFollowRequest(requestId, userId);

    response.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

// Get followers of a user
const handleGetFollowers = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.params.userId;

    const followers = await followService.getFollowers(userId);

    response.status(200).json({
      success: true,
      data: followers,
    });
  }
);

// Get users followed by a user
const handleGetFollowing = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.params.userId;

    const following = await followService.getFollowing(userId);

    response.status(200).json({
      success: true,
      data: following,
    });
  }
);

// Check if the current user follows another user
const handleCheckFollowStatus = asyncHandler(
  async (request: Request, response: Response) => {
    const currentUserId = request.user._id.toString();
    const targetUserId = request.params.userId;

    const status = await followService.checkFollowStatus(
      currentUserId,
      targetUserId
    );

    response.status(200).json({
      success: true,
      data: status,
    });
  }
);

// Get suggested users to follow
const handleGetSuggestions = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();
    const limit = Number(request.query.limit) || 5;

    const suggestions = await followService.getSuggestedUsers(userId, limit);

    response.status(200).json({
      success: true,
      data: suggestions,
    });
  }
);

// Get mutual followers between current user and another user
const handleGetMutualFollowers = asyncHandler(
  async (request: Request, response: Response) => {
    const currentUserId = request.user._id.toString();
    const targetUserId = request.params.userId;
    const limit = Number(request.query.limit) || 10;

    const mutualFollowers = await followService.getMutualFollowers(
      currentUserId,
      targetUserId,
      limit
    );

    response.status(200).json({
      success: true,
      data: mutualFollowers,
    });
  }
);

export {
  handleAcceptFollowRequest,
  handleCheckFollowStatus,
  handleFollow,
  handleGetFollowers,
  handleGetFollowing,
  handleGetFollowRequests,
  handleGetMutualFollowers,
  handleGetSuggestions,
  handleRejectFollowRequest,
  handleUnfollow,
};
