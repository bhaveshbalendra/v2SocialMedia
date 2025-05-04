import { v2 as cloudinary } from "cloudinary";
import { config } from "./app.config";

cloudinary.config({
  secure: config.node_env === "production" ? true : false,
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export default cloudinary;
