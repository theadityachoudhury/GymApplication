//make a base user schema for zod from there extend the client schema for zod

import { z } from "zod";
import { baseUserSchema } from "./baseUser.schema";

export const coachPreferenceSchema = baseUserSchema.extend({
  title: z.string().min(1, "Title is required").optional(),
  about: z.string().min(1, "About is required").optional(),
  specialization: z.array(z.string()).optional(),
});
