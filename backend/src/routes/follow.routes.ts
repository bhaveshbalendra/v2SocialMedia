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

router.post("/:userId/follow", authenticate, handleFollow as RequestHandler);

router.patch(
  "/:requestId/accept-follow-request",
  authenticate,
  handleAcceptFollowRequest as RequestHandler
);

router.post(
  "/:requestId/reject-follow-request",
  authenticate,
  handleRejectFollowRequest as RequestHandler
);

router.delete(
  "/:userId/unfollow",
  authenticate,
  handleUnfollow as RequestHandler
);

// Suggestions and mutual followers
router.get("/suggestions", handleGetSuggestions);

export default router;
