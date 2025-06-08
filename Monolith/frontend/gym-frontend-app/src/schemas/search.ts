import { z } from 'zod';

export const searchSchema = z.object({
	typeOfSport: z.string().min(1, 'Coach is required'),
	date: z.date(),
	time: z.string().min(1, 'Time is required'),
	coach: z.string().min(1, 'Coach is required'),
});

export type searchSchemaData = z.infer<typeof searchSchema>;
