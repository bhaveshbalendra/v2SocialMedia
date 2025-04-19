import { RequestHandler, Router } from "express";
import {
  handleLoginUser,
  handleSignupUser,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", handleSignupUser as RequestHandler);

router.post("/login", handleLoginUser as RequestHandler);

export default router;
