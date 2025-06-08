// src/handlers/coach.handler.ts - Updated debug handler with mongoose import

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { formatJSONResponse, formatErrorResponse } from "@/utils/api-response";
import { logger } from "@/services/logger.service";
import { CoachController } from "@/controllers/coach.controller";
import { DatabaseService } from "@/services/database.service";
import { BookingModel } from "@/models/bookings.model";
import { User, UserRole } from "@/models/user.model";
import mongoose, { Types } from "mongoose"; // Add this import
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { WorkoutModel } from "@/models";

const coachController = new CoachController();

/**
 * Handler for getting all coaches
 */
export const handleGetAllCoaches = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    logger.setContext("getting coaches details");
    logger.info("Getting all coaches");

    const coaches = await coachController.getAllCoaches();

    return formatJSONResponse(200, {
      status: "success",
      data: coaches,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

/**
 * Handler for getting a specific coach profile
 */
export const handleGetCoachById = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    logger.setContext(context);

    const coachId = event.pathParameters?.coachId;
    if (!coachId) {
      return formatJSONResponse(400, {
        status: "error",
        message: "Coach ID is required",
      });
    }

    logger.info("Getting coach by ID", { coachId });

    const coach = await coachController.getCoachById(coachId);

    const specializations = await WorkoutModel.find({
      coachId: new Types.ObjectId(coachId),
    }).populate("workoutType");
    coach.specializations = specializations.map((workout: any) => ({
      id: workout._id,
      name: workout.workoutType.name,
    }));

    return formatJSONResponse(200, {
      status: "success",
      data: coach,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

/**
 * Handler for getting coach available time slots
 */
export const handleGetCoachTimeSlots = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    logger.setContext(context);

    const coachId = event.pathParameters?.coachId;
    if (!coachId) {
      return formatJSONResponse(400, {
        status: "error",
        message: "Coach ID is required",
      });
    }

    // Get date from query parameters
    const date = event.queryStringParameters?.date;
    if (!date) {
      return formatJSONResponse(400, {
        status: "error",
        message: "Date parameter is required",
      });
    }

    logger.info("Getting coach time slots", { coachId, date });

    const timeSlots = await coachController.getCoachAvailableTimeSlots(
      new Types.ObjectId(coachId),
      new Date(date)
    );

    return formatJSONResponse(200, {
      status: "success",
      data: timeSlots,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

/**
 * Handler for getting user bookings for a day
 */
export const handleGetUserDayBookings = async (
  event: AuthenticatedRequest,
  context: Context
) => {
  try {
    logger.setContext(context);

    // Get date from query parameters
    const date = event.queryStringParameters?.date;
    if (!date) {
      return formatJSONResponse(400, {
        status: "error",
        message: "Date parameter is required",
      });
    }

    // Get user ID and role from authenticated request
    const userId = new Types.ObjectId(event.user?.userId);
    if (!userId) {
      return formatJSONResponse(400, {
        status: "error",
        message: "User ID is required",
      });
    }
    const role = event.user?.role|| UserRole.Client; // Default to Client if role is not provided

    logger.info("Getting user bookings for day", { userId, date, role });

    const bookings = await coachController.getUserBookingsForDay(
      userId,
      new Date(date || ""),
      role
    );

    return formatJSONResponse(200, {
      status: "success",
      data: bookings,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};
