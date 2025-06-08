//make a base user schema for zod from there extend the client schema for zod

import { z } from "zod";
import { UserPreferableActivity, UserTarget } from "./auth.schemas";
import { baseUserSchema } from "./baseUser.schema";

export const clientPreferenceSchema = baseUserSchema.extend({
  preferredActivity: z
    .nativeEnum(UserPreferableActivity, {
      errorMap: () => ({ message: "Please select a valid activity" }),
    })
    .optional(),
  target: z
    .nativeEnum(UserTarget, {
      errorMap: () => ({ message: "Please select a valid target" }),
    })
    .optional(),
});
