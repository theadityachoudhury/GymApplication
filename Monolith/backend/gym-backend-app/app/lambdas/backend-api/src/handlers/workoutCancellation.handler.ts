import { z } from "zod";
import { formatErrorResponse, formatJSONResponse } from "@/utils/api-response";
import { WorkoutMapperController } from "@/controllers/workout.controller";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { Types } from "mongoose";

const workoutBookingSchema = z.object({
    bookingId: z.string().nonempty("Workout ID is required"),
});

export const handleWorkoutCancellation = async (event: AuthenticatedRequest) => {
    try {
        const params = event.pathParameters;
        const validatedData = workoutBookingSchema.parse(params)
        const controller = new WorkoutMapperController();
        const data = {
            userId: new Types.ObjectId(event.user?.userId),
            bookingId: new Types.ObjectId(validatedData.bookingId),
        }
        const res = await controller.cancelWorkout(data);

        return formatJSONResponse(201, {
            message: "Workout booking cancelled successfully",
            data: res
        });
    } catch (err) {
        return formatErrorResponse(err);
    }
};
