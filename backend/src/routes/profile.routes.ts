import { Router } from "express";
import {
  handleGetUserProfile,
  handleSearchProfiles,
} from "../controller/profile.controller";

const router = Router();

// Search route - must come before /:username to avoid conflicts
router.get("/search", handleSearchProfiles);

// User profile route
router.get("/:username", handleGetUserProfile);

export default router;
