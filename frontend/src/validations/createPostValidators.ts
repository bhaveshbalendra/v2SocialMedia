import { z } from "zod";

export const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(40, "Max 40 chars")
    .optional(),
  caption: z.string().max(100, "Max 100 chars").optional(),
  description: z.string().max(500, "Max 500 chars").optional(),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(/[#,\s]+/)
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    ),
  media: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // optional
        // Handle FileList (multiple files)
        const fileArray = Array.from(files);

        return fileArray.every(
          (file) => file instanceof File && allowedTypes.includes(file.type)
        );
      },
      {
        message: "All files must be jpeg, png, or gif images",
      }
    ),
  location: z.string().optional(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const initialCreatePostCredentials = {
  title: "",
  caption: "",
  description: "",
  tags: "",
  media: undefined,
  location: "",
};
