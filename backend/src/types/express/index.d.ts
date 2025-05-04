// src/types/express/index.d.ts
import User from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User; // or 'any' if you don't have a User type
    }
  }
}
