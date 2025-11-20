import { z } from "zod";

export const initialLoginCredentials = {
  email_or_username: "demo@email.com",
  password: "demos1234",
};

export const loginSchema = z.object({
  email_or_username: z.string(),
  password: z.string().min(8, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
