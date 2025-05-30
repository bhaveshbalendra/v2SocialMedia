import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import followService from "../service/follow.service";

/**
 * @desc    Follow a user or send follow request
 * @route   POST /api/follow/:userId
 * @access  Private
 */
const handleFollow = asyncHandler(
  async (request: Request, response: Response) => {
    const followerId = request.user!._id; // Currently logged in user
    const followingUserName = request.params.userId; // User to follow

    const result = await followService.follow({
      followerId: followerId.toString(),
      followingUserName,
    });

    response.status(200).json({
      success: true,
      message: result.message,
    });
    return;
  }
);

/**
 * @desc    Unfollow a user
 * @route   DELETE /api/follow/:userId
 * @access  Private
 */
const handleUnfollow = asyncHandler(async (req: Request, res: Response) => {
  const followerId = req.user!._id; // Currently logged in user
  const followingId = req.params.userId; // User to unfollow
  console.log(followerId, followingId);

  const result = await followService.unfollow(
    followingId,
    followerId.toString()
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Get pending follow requests for the current user
 * @route   GET /api/follow/requests
 * @access  Private
 */
const handleGetFollowRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const requests = await followService.getFollowRequests(userId.toString());

    res.status(200).json({
      success: true,
      data: requests,
    });
  }
);

/**
 * @desc    Accept a follow request
 * @route   PATCH /api/follow/requests/:requestId/accept
 * @access  Private
 */
const handleAcceptFollowRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const requestId = req.params.requestId;

    const result = await followService.acceptFollowRequest(
      requestId,
      userId.toString()
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

/**
 * @desc    Reject a follow request
 * @route   PATCH /api/follow/requests/:requestId/reject
 * @access  Private
 */
const handleRejectFollowRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const requestId = req.params.requestId;

    const result = await followService.rejectFollowRequest(
      requestId,
      userId.toString()
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

/**
 * @desc    Get followers of a user
 * @route   GET /api/follow/:userId/followers
 * @access  Private
 */
const handleGetFollowers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const followers = await followService.getFollowers(userId);

  res.status(200).json({
    success: true,
    data: followers,
  });
});

/**
 * @desc    Get users followed by a user
 * @route   GET /api/follow/:userId/following
 * @access  Private
 */
const handleGetFollowing = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const following = await followService.getFollowing(userId);

  res.status(200).json({
    success: true,
    data: following,
  });
});

/**
 * @desc    Check if the current user follows another user
 * @route   GET /api/follow/check/:userId
 * @access  Private
 */
const handleCheckFollowStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = req.user!._id;
    const targetUserId = req.params.userId;

    const status = await followService.checkFollowStatus(
      currentUserId.toString(),
      targetUserId
    );

    res.status(200).json({
      success: true,
      data: status,
    });
  }
);

/**
 * @desc    Get suggested users to follow
 * @route   GET /api/follow/suggestions
 * @access  Private
 */
const handleGetSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const limit = Number(req.query.limit) || 5;

    const suggestions = await followService.getSuggestedUsers(
      userId.toString(),
      limit
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  }
);

/**
 * @desc    Get mutual followers between current user and another user
 * @route   GET /api/follow/mutual/:userId
 * @access  Private
 */
const handleGetMutualFollowers = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = req.user!._id;
    const targetUserId = req.params.userId;
    const limit = Number(req.query.limit) || 10;

    const mutualFollowers = await followService.getMutualFollowers(
      currentUserId.toString(),
      targetUserId,
      limit
    );

    res.status(200).json({
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
