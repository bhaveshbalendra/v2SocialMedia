import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,

  allowed_origins: process.env.ALLOWED_ORIGINS || "http://localhost:5173",

  // MongoDB Configuration
  db: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  },

  // File Upload Configuration
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    directory: process.env.UPLOAD_DIR || "uploads",
  },

  // Cloudinary Configuration
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },
};
