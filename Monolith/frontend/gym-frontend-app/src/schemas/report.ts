import { z } from 'zod';

// Define the schema for the report form data
export const reportSchema = z.object({
  reportType: z.string().nonempty("Report type is required"), // Must be a non-empty string
  period: z.string().nonempty("Period is required"), // Must be a non-empty string
  gym: z.string().nonempty("Gym is required"), // Must be a non-empty string
});

// Define the TypeScript type for the form data based on the schema
export type reportSchemaData = z.infer<typeof reportSchema>;