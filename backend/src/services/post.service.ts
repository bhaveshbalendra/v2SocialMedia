import { Request } from "express";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.config";
import { AppError } from "../middlewares/error.middleware";
import Comment from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import getDataUri from "../utils/datauri";

class PostService {
  async createPost(request: Request) {
    const { caption, tags, title, description, location } = request.body;
    const files = request.files as Express.Multer.File[];
    const userId = request.user._id;

    if (!files || files.length === 0) throw AppError.emptyOrInvalidData();

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

    return post;
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
      });
    // .populate({
    //   path: "comments",
    //   options: {
    //     sort: { createdAt: -1 },
    //   },
    //   populate: { path: "author", select: "username profilePicture" },
    // });
    return posts;
  }
}

export default new PostService();
