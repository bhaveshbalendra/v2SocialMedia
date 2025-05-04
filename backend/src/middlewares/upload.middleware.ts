import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { AppError } from "./error.middleware";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PNG, JPG, and GIF files are allowed!"));
  }
};

export const uploadMultiple = (field: string, maxCount: number = 5) => {
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter,
  }).array(field, maxCount);

  return (req: Request, res: Response, next: NextFunction): void => {
    upload(req, res, (error: any) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return next(new AppError("File too large. Maximum size is 2MB", 400));
        } else if (error.code === "LIMIT_FILE_COUNT") {
          return next(new AppError("Too many files uploaded", 400));
        }
      } else if (error) {
        return next(new AppError(error.message, 400));
      }
      next();
    });
  };
};
