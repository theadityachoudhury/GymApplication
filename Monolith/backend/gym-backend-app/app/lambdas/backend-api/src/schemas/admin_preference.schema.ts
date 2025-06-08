//make a base user schema for zod from there extend the client schema for zod

import { z } from "zod";
import { UserPreferableActivity, UserTarget } from "./auth.schemas";
import { baseUserSchema } from "./baseUser.schema";

export const adminPreferenceSchema = baseUserSchema.extend({
  phoneNumber: z.number().optional(),
});
