// src/handlers/feedback.handler.ts

import {
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { formatJSONResponse } from "@/utils/api-response";
import { FeedbackController } from "@/controllers/feedback.controller";
import { z } from "zod";
import HttpError from "@/utils/http-error";
import { Types } from "mongoose";
import { logger } from "@/services/logger.service";

// Schema for adding feedback
const addFeedbackSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  message: z.string().min(1, "Message is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
});

// Schema for getting feedback
const getFeedbackSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1")),
  perPage: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10")),
  sortBy: z.string().optional().default("timestamp"),
});

export const handleAddFeedback = async (
  event: AuthenticatedRequest
): Promise<APIGatewayProxyResult> => {
  try {
    logger.setContext("handleAddFeedback");
    const userId = new Types.ObjectId(event.user?.userId);
    const body = JSON.parse(event.body || "{}");

    const { bookingId, message, rating } = addFeedbackSchema.parse(body);

    const controller = new FeedbackController();
    const feedback = await controller.addFeedback({
      userId,
      bookingId: new Types.ObjectId(bookingId),
      message,
      rating,
    });

    return formatJSONResponse(201, {
      status: "success",
      message: "Feedback added successfully",
      data: feedback,
    });
  } catch (err) {
    logger.error("Error in handleAddFeedback:", err);
    const error =
      err instanceof HttpError
        ? err
        : new HttpError(400, "Failed to add feedback", err);
    return formatJSONResponse(error.status, {
      status: "error",
      message: error.message,
      error: error.details,
    });
  };
}

  export const handleGetCoachFeedback = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    try {
      logger.setContext("handleGetCoachFeedbackPublic");

      // Get coach ID from path parameters
      const coachId = event.pathParameters?.coachId;
      if (!coachId) {
        throw new HttpError(400, "Coach ID is required");
      }

      // Parse query parameters
      const { page, perPage, sortBy } = getFeedbackSchema.parse(
        event.queryStringParameters || {}
      );

      const controller = new FeedbackController();
      const feedbackData = await controller.getFeedbackForCoach(
        new Types.ObjectId(coachId),
        perPage,
        page,
        sortBy
      );

      return formatJSONResponse(200, {
        status: "success",
        message: "Feedback retrieved successfully",
        data: feedbackData,
      });
    } catch (err) {
      logger.error("Error in handleGetCoachFeedbackPublic:", err);
      const error =
        err instanceof HttpError
          ? err
          : new HttpError(400, "Failed to retrieve feedback", err);
      return error.toApiResponse();
    }
  };
