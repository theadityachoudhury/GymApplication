import { z } from "zod";

export const createWorkoutOptionSchema = z.object({
  name: z.string().min(2, "Workout name is required"),
});
