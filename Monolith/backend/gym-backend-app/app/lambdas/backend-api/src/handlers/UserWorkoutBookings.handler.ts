import { z } from "zod";
import { formatErrorResponse, formatJSONResponse } from "@/utils/api-response";
import { WorkoutMapperController } from "@/controllers/workout.controller";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { Types } from "mongoose";

export const handleGetUserBookings = async (event: AuthenticatedRequest) => {
    try {
        const controller = new WorkoutMapperController();
        const userId = new Types.ObjectId(event.user?.userId);
        const data = {
            userId
        }
        const res = await controller.getUserBookings(data);

        return formatJSONResponse(201, {
            message: "Workout bookings fetched successfully",
            data: res
        });
    } catch (err) {
        return formatErrorResponse(err);
    }
};
