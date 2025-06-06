import { Router } from "express";
import {
  handleGetUserProfile,
  handleSearchProfiles,
} from "../controller/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/search", authenticate, handleSearchProfiles);
router.get("/:username", handleGetUserProfile);

export default router;
