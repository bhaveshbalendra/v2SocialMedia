import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(20, "Username must be at most 20 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email_or_username: z.string(),
  password: z.string().min(8, "Password is required"),
});

export const createPostSchema = z.object({
  title: z.string().min(1).max(40),
  caption: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
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
    .refine((file) => !file || file instanceof File, {
      message: "Must be a file",
    })
    .optional(),
});
export type CreatePostSchema = z.infer<typeof createPostSchema>;
