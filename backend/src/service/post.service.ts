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
    const { caption, title, description, location } = request.body;
    let { tags } = request.body;

    // Parse tags if they come as JSON string from FormData
    // Note: The validation middleware might have already parsed this
    if (typeof tags === "string") {
      try {
        console.log("Parsing tags from JSON string:", tags);
        tags = JSON.parse(tags);
        console.log("Parsed tags:", tags);
      } catch (error) {
        console.log("Failed to parse tags JSON, treating as single tag:", tags);
        // If parsing fails, treat it as a single tag or empty array
        tags = tags ? [tags] : [];
      }
    } else if (Array.isArray(tags)) {
      console.log("Tags already parsed as array:", tags);
    } else {
      console.log("Tags received as:", typeof tags, tags);
      tags = tags ? [tags] : [];
    }

    const files = request.files as Express.Multer.File[];
    const userId = request.user._id;

    if (!files || files.length === 0) throw AppError.emptyOrInvalidData();

    const authUser = await User.findById(userId);

    /**  console.log(files);
    [
      {
        fieldname: 'media',
        originalname: 'snow.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 09 06 07 08 07 06 09 08 08 08 0a 0a 09 0b 0e 17 0f 0e 0d 0d 0e 1c 14 15 11 ... 33645 more bytes>,
        size: 33695
      }
    ]
    [INFO] 14:57:11 Restarting: D:\projects\v2SocialMedia\backend\src\middlewares\auth.middleware.ts has been modified
    Connected to MongoDB
    Server is running on http://localhost:8000
    [
      {
        fieldname: 'media',
        originalname: 'hbo.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 df 00 00 00 df 08 03 00 00 00 41 27 f6 1e 00 00 00 27 50 4c 54 45 ff ff ff 10 10 10 0e 0e 0e ... 2320 more bytes>,
        size: 2370
      },
      {
        fieldname: 'media',
        originalname: 'india-flag-icon.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 00 00 00 02 00 08 06 00 00 00 f4 78 d4 fa 00 00 00 09 70 48 59 73 00 00 0e c4 00 00 0e c4 01 ... 25094 more bytes>,
        size: 25144
      },
      {
        fieldname: 'media',
        originalname: 'profilephoto.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 f4 00 00 01 f4 08 03 00 00 00 fc 08 2f b8 00 00 03 00 50 4c 54 45 c0 d3 df a6 c2 d5 bc d1 de ... 101076 more bytes>,
        size: 101126
      },
      {
        fieldname: 'media',
        originalname: 'selena-gomez.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 fa 00 00 00 fa 08 03 00 00 00 bf 32 aa 0f 00 00 00 a5 50 4c 54 45 be 86 75 b7 7d 6d bd 83 73 ... 22269 more bytes>,
        size: 22319
      }
    ]
      */

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
        tags,
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
        tags,
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

  async getAllPostsNotLoginUser(cursor?: string, limit: number = 5) {
    const query: any = {
      visibility: "public",
      isArchived: false,
      isDeleted: false,
    };

    // If cursor is provided, add condition to get posts created before cursor
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(query)
      .select("-updatedAt -__v")
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "author",
        select: "username profilePicture",
      });

    // Get the cursor for next page (createdAt of last post)
    const nextCursor =
      posts.length > 0 ? posts[posts.length - 1].createdAt : null;
    const hasMore = posts.length === limit;

    return {
      posts,
      pagination: {
        nextCursor,
        hasMore,
        limit,
      },
    };
  }

  async getPostForLoginUser(
    userId: string,
    cursor?: string,
    limit: number = 5
  ) {
    // Get the current user with their following list
    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      throw AppError.notFoundError("User not found");
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new Types.ObjectId(userId);

    const matchStage: any = {
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
    };

    // Add cursor condition if provided
    if (cursor) {
      matchStage.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.aggregate([
      {
        $match: matchStage,
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
      {
        $limit: limit,
      },
    ]);

    // Get the cursor for next page (createdAt of last post)
    const nextCursor =
      posts.length > 0 ? posts[posts.length - 1].createdAt : null;
    const hasMore = posts.length === limit;

    return {
      posts,
      pagination: {
        nextCursor,
        hasMore,
        limit,
      },
    };
  }

  async deletePost(userId: string, postId: string) {
    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      throw AppError.notFoundError("Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
      throw AppError.unauthorizedError("You can only delete your own posts");
    }

    // Check if post is already deleted
    if (post.isDeleted) {
      throw AppError.emptyOrInvalidData("Post is already deleted");
    }

    // Delete images from Cloudinary
    if (post.media && post.media.length > 0) {
      await Promise.all(
        post.media.map(async (mediaItem) => {
          if (mediaItem.publicId) {
            try {
              await cloudinary.uploader.destroy(mediaItem.publicId);
            } catch (error) {
              console.error(
                `Failed to delete image ${mediaItem.publicId}:`,
                error
              );
              // Continue with deletion even if cloudinary deletion fails
            }
          }
        })
      );
    }

    // Mark post as deleted (soft delete) or completely remove
    await Post.findByIdAndDelete(postId);

    // Remove post reference from user's posts array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } },
      { new: true }
    );

    return { message: "Post deleted successfully" };
  }
}

export default new PostService();
