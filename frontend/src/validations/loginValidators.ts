import { z } from "zod";

export const initialLoginCredentials = {
  email_or_username: "",
  password: "",
};

export const loginSchema = z.object({
  email_or_username: z.string(),
  password: z.string().min(8, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
