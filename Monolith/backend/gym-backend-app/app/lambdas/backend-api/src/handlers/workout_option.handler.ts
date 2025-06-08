import { APIGatewayProxyEvent } from "aws-lambda";
import { createWorkoutOptionSchema } from "@/schemas/workout_option.schema";
import HttpError from "@/utils/http-error";
import { WorkoutMapperController } from "@/controllers/workout.controller";
import { formatJSONResponse } from "@/utils/api-response";

const controller = new WorkoutMapperController();
type CoachOptionsList = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  __t: string;
};

type WorkoutOptionsList = {
  _id: string;
  name: string;
  coachesId: CoachOptionsList[];
  __v: number;
};

type SelectOption = {
  value: string,
  label: string
}

export const createWorkoutOption = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name } = createWorkoutOptionSchema.parse(body);
    const workout = await controller.create(name);

    return formatJSONResponse(201, {
      message: "Workout option created",
      data: workout,
    })

  } catch (error) {
    if (error instanceof HttpError) return error.toApiResponse();
    return new HttpError(500, "Internal server error", error).toApiResponse();
  }
};

export const getWorkoutOptions = async (event: APIGatewayProxyEvent) => {
  try {
    const data = await controller.getAll() as WorkoutOptionsList[];

    const workoutOption = data.map(workout => ({
      value: workout._id,
      label: workout.name
    }));

    // Coach IDs and Names
    const coachOptionsMap = new Map<string, SelectOption>();

    data.forEach(workout => {
      workout.coachesId.forEach(coach => {
        if (!coachOptionsMap.has(coach._id)) {
          coachOptionsMap.set(coach._id, {
            value: coach._id,
            label: `${coach.firstName} ${coach.lastName}`,
          });
        }
      });
    });

    const coachOptions: SelectOption[] = Array.from(coachOptionsMap.values());

    return formatJSONResponse(200, { workoutOption, coachOptions })
  } catch (error) {
    return new HttpError(500, "Failed to fetch workouts", error).toApiResponse();
  }
};
