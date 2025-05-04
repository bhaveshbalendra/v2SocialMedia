import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,

  allowed_origins:
    process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",

  // MongoDB Configuration
  db: {
    uri: process.env.MONGODB_URI || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || 900,
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || 604800,
  },

  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  },
};
