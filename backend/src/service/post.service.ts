import { Request } from "express";
import { Types } from "mongoose";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.config";
import { AppError } from "../middleware/error.middleware";
import Post from "../models/post.model";
import User from "../models/user.model";

import { PostVisibility } from "../types/schema.types";
import getDataUri from "../utils/datauri.util";

class PostService {
  async createPost(request: Request) {
    const { caption, tags, title, description, location } = request.body;
    const files = request.files as Express.Multer.File[];
    const userId = request.user._id;

    if (!files || files.length === 0) throw AppError.emptyOrInvalidData();

    // Parse tags if they come as a JSON string from FormData
    let parsedTags: string[] = [];
    if (tags) {
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
        } catch {
          // If parsing fails, treat as comma-separated string
          parsedTags = tags
            .split(/[#,\s]+/)
            .map((tag: string) => tag.trim())
            .filter(Boolean);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    const authUser = await User.findById(userId);

    // Upload all images to Cloudinary after resizing
    const media = await Promise.all(
      files.map(async (file) => {
        const optimizedImageBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 800, fit: "inside" })
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();

        const fileUri = getDataUri(optimizedImageBuffer, file);

        const cloudResponse = await cloudinary.uploader.upload(
          fileUri as string
        );

        return {
          url: cloudResponse.secure_url,
          type: "image",
          publicId: cloudResponse.public_id,
        };
      })
    );

    if (authUser?.isPrivate) {
      const post = await Post.create({
        caption,
        media,
        author: userId,
        tags: parsedTags,
        title,
        description,
        location,
        visibility: PostVisibility.Private,
      });

      // FIX: use _id instead of id for MongoDB documents
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post._id } },
        { new: true }
      );

      // Populate the author field before returning
      const populatedPost = await Post.findById(post._id)
        .populate({
          path: "author",
          select: "username profilePicture",
        })
        .select("-updatedAt -__v");

      return populatedPost;
    } else {
      const post = await Post.create({
        caption,
        media,
        author: userId,
        tags: parsedTags,
        title,
        description,
        location,
      });

      // FIX: use _id instead of id for MongoDB documents
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post._id } },
        { new: true }
      );

      // Populate the author field before returning
      const populatedPost = await Post.findById(post._id)
        .populate({
          path: "author",
          select: "username profilePicture",
        })
        .select("-updatedAt -__v");

      return populatedPost;
    }
  }

  async getAllPostsNotLoginUser() {
    const posts = await Post.find({
      visibility: "public",
      isArchived: false,
      isDeleted: false,
    })
      .select("-updatedAt -__v")
      .sort({ createdAt: -1 }) // FIX: use createdAt, not created
      .populate({
        path: "author",
        select: "username profilePicture",
      })

      .lean(); // Use lean to return plain JavaScript objects

    return posts;
  }

  async getPostForLoginUser(userId: string) {
    // Get the current user with their following list
    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      throw AppError.notFoundError("User not found");
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new Types.ObjectId(userId);

    const posts = await Post.aggregate([
      {
        $match: {
          isArchived: false,
          isDeleted: false,
          $or: [
            { visibility: "public" }, // All public posts
            { author: userObjectId }, // Your own posts (public/private)
            {
              $and: [
                { author: { $in: currentUser.following } }, // Posts from followed users
                { visibility: "private" }, // Only their private posts
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                username: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          updatedAt: 0,
          __v: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return posts;
  }
}

export default new PostService();
