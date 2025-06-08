import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { formatJSONResponse, formatErrorResponse } from "@/utils/api-response";
import { logger } from "@/services/logger.service";
import { WorkoutMapperController } from "@/controllers/workout.controller";

export const getFilteredCoachesHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const start = Date.now();

  try {
    logger.setContext("getFilteredCoachesHandler");
    logger.logApiGatewayRequest(event, context);

    const queryParams = event.queryStringParameters;
    const workoutId = queryParams?.workoutId;
    const coachId = queryParams?.coachId;
    const timeSlotId = queryParams?.timeSlotId;
    const date = queryParams?.date ? new Date(queryParams.date) : undefined;

    console.log("Query Params:", queryParams);
    const controller = new WorkoutMapperController()
    const result = await controller.getFilteredCoaches(workoutId, coachId, timeSlotId, date);

    const response = formatJSONResponse(200, {
      status: "success",
      message: "Filtered coach data retrieved",
      data: result,
    });

    logger.logApiGatewayResponse(response, Date.now() - start);
    return response;

  } catch (error) {
    logger.logApiGatewayError(error as Error, event, context);
    return formatErrorResponse(error);
  }
};
