import { Router } from "express";
import { handleGetUserProfile } from "../controller/profile.controller";

const router = Router();

router.get("/:username", handleGetUserProfile);

export default router;
