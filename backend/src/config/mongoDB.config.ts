import mongoose from "mongoose";
import { config } from "./app.config";

const MONGO_URI = config.db.uri;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
