import { Router } from "express";
import followController from "../controllers/follow.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route   POST /api/v2/follow/:userId
 * @desc    Follow a user
 * @access  Private
 */
router.post("/:userId", authenticate, followController.followUser);

/**
 * @route   DELETE /api/v2/follow/:userId
 * @desc    Unfollow a user
 * @access  Private
 */
router.delete("/:userId", authenticate, followController.unfollowUser);

/**
 * @route   PUT /api/v2/follow/accept/:userId
 * @desc    Accept a follow request
 * @access  Private
 */
router.put(
  "/accept/:userId",
  authenticate,
  followController.acceptFollowRequest
);

/**
 * @route   PUT /api/v2/follow/reject/:userId
 * @desc    Reject a follow request
 * @access  Private
 */
router.put(
  "/reject/:userId",
  authenticate,
  followController.rejectFollowRequest
);

/**
 * @route   GET /api/v2/follow/followers/:userId?
 * @desc    Get a user's followers
 * @access  Private
 */
router.get("/followers/:userId?", authenticate, followController.getFollowers);

/**
 * @route   GET /api/v2/follow/following/:userId?
 * @desc    Get users the specified user is following
 * @access  Private
 */
router.get("/following/:userId?", authenticate, followController.getFollowing);

/**
 * @route   GET /api/v2/follow/pending
 * @desc    Get pending follow requests
 * @access  Private
 */
router.get("/pending", authenticate, followController.getPendingRequests);

/**
 * @route   GET /api/v2/follow/status/:userId
 * @desc    Check follow status between current user and specified user
 * @access  Private
 */
router.get("/status/:userId", authenticate, followController.checkFollowStatus);

/**
 * @route   GET /api/v2/follow/counts/:userId?
 * @desc    Get follow counts for a user
 * @access  Private
 */
router.get("/counts/:userId?", authenticate, followController.getFollowCounts);

export default router;
