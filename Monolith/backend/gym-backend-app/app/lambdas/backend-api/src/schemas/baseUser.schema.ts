import { z } from "zod";

export const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  currentPassword: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  confirmPassword: z.string().min(8, "Confirm password is required").optional(),
  image: z.string().optional(),
});
