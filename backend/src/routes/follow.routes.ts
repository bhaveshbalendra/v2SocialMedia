import { RequestHandler, Router } from "express";
import {
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
} from "../controller/follow.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Require authentication for all follow routes
router.use(authenticate);

// Follow/unfollow routes
router.post("/:userId", handleFollow);
router.delete("/:userId", handleUnfollow);

// Follow request management
router.get("/requests", handleGetFollowRequests);
router.patch("/requests/:requestId/accept", handleAcceptFollowRequest);
router.patch("/requests/:requestId/reject", handleRejectFollowRequest);

// Follower/following lists
router.get("/:userId/followers", handleGetFollowers);
router.get("/:userId/following", handleGetFollowing);

// Follow status check
router.get("/check/:userId", handleCheckFollowStatus);

// Suggestions and mutual followers
router.get("/suggestions", handleGetSuggestions);
router.get("/mutual/:userId", handleGetMutualFollowers);

export default router;
