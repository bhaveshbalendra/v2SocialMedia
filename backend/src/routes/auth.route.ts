import { RequestHandler, Router } from "express";
import {
  handleLoginUser,
  handleSignupUser,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validator.middleware";
import { userValidation } from "../utils/validators";

const router = Router();

router.post(
  "/signup",
  validateRequest(userValidation.signup),
  handleSignupUser as RequestHandler
);

router.post("/login", handleLoginUser as RequestHandler);

export default router;
