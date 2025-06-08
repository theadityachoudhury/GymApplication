import { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import HttpError from "@/utils/http-error";
import { formatJSONResponse } from "@/utils/api-response";
import { WorkoutMapperController } from "@/controllers/workout.controller";

const mapSchema = z.object({
  coachId: z.string(),
  workoutIds: z.array(z.string())
});

export const handleWorkoutMapping = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { coachId, workoutIds } = mapSchema.parse(body);
    const controller = new WorkoutMapperController();
    const saved = await controller.mapWorkoutsToCoach(coachId, workoutIds);

    return formatJSONResponse(201, {
      message: "Workout mappings created successfully",
      data: saved
    });
  } catch (err) {
    const error = err instanceof HttpError ? err : new HttpError(500, "Workout mapping failed", err);
    return error.toApiResponse();
  }
};
