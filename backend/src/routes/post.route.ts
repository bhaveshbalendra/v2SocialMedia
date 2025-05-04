import express, { RequestHandler } from "express";
import { handleCreatePost } from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadMultiple } from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validator.middleware";
import { postValidator } from "../utils/validators";

const router = express.Router();

router.post(
  "/create-post",
  authenticate,
  uploadMultiple("media", 5),
  validateRequest(postValidator.create),
  handleCreatePost as RequestHandler
);

export default router;
