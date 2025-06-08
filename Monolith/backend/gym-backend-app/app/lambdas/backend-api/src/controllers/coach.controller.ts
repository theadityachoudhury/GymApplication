// src/controllers/coach.controller.ts
import { CoachService } from "@/services/coach.service";
import { logger } from "@/services/logger.service";
import HttpError from "@/utils/http-error";
import { UserRole } from "@/models/user.model";
import { z } from "zod";
import { Types } from "mongoose";

// Validation schema for date parameter
const dateSchema = z.date().refine(
  (date) => {
    // Accept either a simple date string or just a day number
    return !isNaN(Date.parse(date)) || /^\d+$/.test(date);
  },
  {
    message: "Invalid date format",
  }
);

export class CoachController {
  private coachService: CoachService;

  constructor() {
    this.coachService = new CoachService();
  }

  /**
   * Get all coaches
   */
  async getAllCoaches(): Promise<any> {
    try {
      logger.info("Getting all coaches");
      return await this.coachService.getAllCoaches();
    } catch (error) {
      logger.error("Error getting all coaches", error as Error);
      throw error;
    }
  }

  /**
   * Get coach profile by ID
   */
  async getCoachById(coachId: string): Promise<any> {
    try {
      logger.info("Getting coach profile", { coachId });
      return await this.coachService.getCoachById(coachId);
    } catch (error) {
      logger.error("Error getting coach profile", error as Error);
      throw error;
    }
  }

  /**
   * Get available time slots for a coach
   */
  async getCoachAvailableTimeSlots(
    coachId: Types.ObjectId,
    date: Date
  ): Promise<any> {
    try {
      logger.info("Getting coach available time slots", { coachId, date });

      // Validate date parameter
      const validatedDate = dateSchema.parse(date);

      return await this.coachService.getCoachAvailableTimeSlots(
        coachId,
        validatedDate
      );
    } catch (error) {
      logger.error("Error getting coach available time slots", error as Error);
      if (error instanceof z.ZodError) {
        throw new HttpError(400, "Invalid date format", error.errors);
      }
      throw error;
    }
  }

  /**
   * Get bookings for a user on a specific day
   */
  async getUserBookingsForDay(
    userId: Types.ObjectId,
    date: Date,
    role: UserRole
  ): Promise<any> {
    try {
      logger.info("Getting user bookings for day", { userId, date, role });

      // Validate date parameter
      const validatedDate = dateSchema.parse(date);

      return await this.coachService.getUserBookingsForDay(
        userId,
        validatedDate,
        role
      );
    } catch (error) {
      logger.error("Error getting user bookings for day", error as Error);
      if (error instanceof z.ZodError) {
        throw new HttpError(400, "Invalid date format", error.errors);
      }
      throw error;
    }
  }
}
