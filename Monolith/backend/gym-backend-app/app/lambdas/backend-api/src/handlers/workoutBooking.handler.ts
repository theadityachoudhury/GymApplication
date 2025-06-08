import { z } from "zod";
import { formatErrorResponse, formatJSONResponse } from "@/utils/api-response";
import { WorkoutMapperController } from "@/controllers/workout.controller";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { Types } from "mongoose";

const workoutBookingSchema = z.object({
    workoutId: z.string().nonempty("Workout ID is required"),
    coachId: z.string().nonempty("Coach ID is required"),
    timeSlotId: z.string().nonempty("Time Slot ID is required"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});

export const handleWorkoutBooking = async (event: AuthenticatedRequest) => {
    try {
        if (!event.body) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Missing request body'
            });
        }
        const body = JSON.parse(event.body);
        const validatedData = workoutBookingSchema.parse(body)
        const controller = new WorkoutMapperController();
        const data = {
            clientId: new Types.ObjectId(event.user?.userId),
            workoutId: new Types.ObjectId(validatedData.workoutId),
            coachId: new Types.ObjectId(validatedData.coachId),
            timeSlotId: new Types.ObjectId(validatedData.timeSlotId),
            date: new Date(validatedData.date),
        }
        const res = await controller.bookWorkout(data);

        return formatJSONResponse(201, {
            message: "Workout booking created successfully",
            data: res
        });
    } catch (err) {
        return formatErrorResponse(err);
    }
};
