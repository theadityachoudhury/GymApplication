// src/services/coach.service.ts
import { Coach, UserRole, User } from "@/models/user.model";
import { DatabaseService } from "./database.service";
import { CoachDataModel } from "@/models/coach.model";
import { TimeSlotModel } from "@/models/timeSlot.model";
import { BookingModel, BookingStateEnum } from "@/models/bookings.model";
// Import WorkoutOption model to ensure it's registered
import { WorkoutOption } from "@/models/workout_options.model";
import { logger } from "./logger.service";
import HttpError from "@/utils/http-error";
import mongoose, { Types } from "mongoose";
import { WorkoutService } from "./workout.service";

export class CoachService {
  private dbService: DatabaseService;
  private workoutService: WorkoutService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.workoutService = new WorkoutService();
  }

  /**
   * Get all coaches with their details
   */
  async getAllCoaches(): Promise<any[]> {
    try {
      await this.dbService.connect();

      // Find all users with coach role
      const coaches = await Coach.find().lean();

      // Get all coach IDs
      const coachIds = coaches
        .filter((coach: any) => coach.coachId)
        .map((coach: any) => coach.coachId);

      // Get all coach details in one query
      const coachDetails = await CoachDataModel.find({
        _id: { $in: coachIds },
      }).lean();

      // Create a map for quick lookup
      const coachDetailsMap = new Map();
      coachDetails.forEach((detail: any) => {
        coachDetailsMap.set(detail._id.toString(), detail);
      });

      // Get all specializations for these coaches
      const allSpecializationIds = [];
      for (const detail of coachDetails) {
        if (detail.specialization && detail.specialization.length > 0) {
          allSpecializationIds.push(...detail.specialization);
        }
      }

      // Fetch all specializations in one query
      const specializations = await WorkoutOption.find({
        _id: { $in: allSpecializationIds },
      }).lean();

      // Create a map for specializations
      const specializationsMap = new Map();
      specializations.forEach((spec) => {
        specializationsMap.set(spec._id.toString(), spec);
      });

      // Process the coaches to return a clean response
      return coaches.map((coach) => {
        const coachDetail = coach.coachId
          ? coachDetailsMap.get(coach.coachId.toString())
          : null;

        // Map specializations if they exist
        let coachSpecializations = [];
        if (coachDetail && coachDetail.specialization) {
          coachSpecializations = coachDetail.specialization
            .map((specId: any) => {
              const spec = specializationsMap.get(specId.toString());
              return spec
                ? {
                  _id: spec._id,
                  name: spec.name,
                }
                : null;
            })
            .filter(Boolean); // Remove null entries
        }

        return {
          id: coach._id,
          firstName: coach.firstName,
          lastName: coach.lastName,
          email: coach.email,
          image: coach.image || "",
          gym: coach.gym,
          specialization: coachSpecializations,
          title: coachDetail?.title || "",
          about: coachDetail?.about || "",
          rating: coachDetail?.rating || 0,
          workingDays: coachDetail?.workingDays || [],
        };
      });
    } catch (error) {
      logger.error("Error fetching all coaches", error as Error);
      throw new HttpError(500, "Failed to fetch coaches");
    }
  }

  /**
   * Get coach profile by ID with specializations
   */
  async getCoachById(coachId: string): Promise<any> {
    try {
      await this.dbService.connect();

      if (!mongoose.Types.ObjectId.isValid(coachId)) {
        throw new HttpError(400, "Invalid coach ID format");
      }

      // First get the coach user
      const coach = await Coach.findById(coachId).lean();
      if (!coach) {
        throw new HttpError(404, "Coach not found");
      }

      // Then get coach details separately
      let coachDetails = null;
      if (coach.coachId) {
        coachDetails = await CoachDataModel.findById(coach.coachId).lean();
      }

      // Get specializations separately if needed
      let specializations: any = [];
      if (
        coachDetails &&
        coachDetails.specialization &&
        coachDetails.specialization.length > 0
      ) {
        specializations = await WorkoutOption.find({
          _id: { $in: coachDetails.specialization },
        }).lean();
      }

      // Get certificates separately if needed
      let certificates: any = [];
      if (
        coachDetails &&
        coachDetails.certificates &&
        coachDetails.certificates.length > 0
      ) {
        // Assuming you have a Certificate model
        // certificates = await Certificate.find({
        //   _id: { $in: coachDetails.certificates }
        // }).lean();

        // If you don't have a Certificate model yet, use this placeholder
        certificates = coachDetails.certificates;
      }

      // Combine the data
      return {
        id: coach._id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        image: coach.image || "",
        gym: coach.gym,
        specialization: specializations,
        title: coachDetails?.title || "",
        about: coachDetails?.about || "",
        rating: coachDetails?.rating || 0,
        certificates: certificates,
        workingDays: coachDetails?.workingDays || [],
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching coach by ID", error as Error);
      throw new HttpError(500, "Failed to fetch coach details");
    }
  }

  /**
   * Get available time slots for a coach on a specific date
   */
  async getCoachAvailableTimeSlots(
    coachId: Types.ObjectId,
    date: Date
  ): Promise<any[]> {
    try {

      if (!mongoose.Types.ObjectId.isValid(coachId)) {
        throw new HttpError(400, "Invalid coach ID format");
      }

      // Parse and validate date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpError(400, "Invalid date format");
      }

      // Find the coach to check working days
      const coach = await Coach.findById(coachId);
      if (!coach) {
        throw new HttpError(404, "Coach not found");
      }

      // Check if the coach works on this day (assuming coach has workingDays property)
      // const dayOfWeek = parsedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      // if (coach.workingDays && !coach.workingDays.includes(dayOfWeek)) {
      //   return []; // Coach doesn't work on this day
      // }

      // Get all the time slots
      const timeSlots = await TimeSlotModel.find();
      console.log(timeSlots)
      if (!timeSlots || timeSlots.length === 0) {
        throw new HttpError(404, "No time slots available");
      }

      // Get all the bookings for this date for this coach
      const bookings = await BookingModel.find({
        coachId: coachId,
        date: date,
        state: {
          $in: [
            BookingStateEnum.SCHEDULED,
            BookingStateEnum.COMPLETED,
            BookingStateEnum.WAITING_FOR_FEEDBACK
          ]
        }
      });

      console.log("Bookings for the date", bookings);

      // Make a new array and add a new field called isBooked to each time slot
      const slotsWithBookingStatus = timeSlots.map((slot: any) => {
        const isBooked = bookings.some(
          (booking: any) =>
            booking.timeSlotId.toString() === slot._id.toString() &&
            [
              BookingStateEnum.SCHEDULED,
              BookingStateEnum.COMPLETED,
              BookingStateEnum.WAITING_FOR_FEEDBACK
            ].includes(booking.state as BookingStateEnum)
        );

        return {
          id: slot._id.toString(),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: isBooked,
        };
      });

      logger.info("Slots with booking status", slotsWithBookingStatus);
      console.log("Slots with booking status", slotsWithBookingStatus);
      return slotsWithBookingStatus;

    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching coach available time slots", error as Error);
      throw new HttpError(500, "Failed to fetch available time slots");
    }
  }

  /**
   * Get bookings for a user on a specific day
   */
  async getUserBookingsForDay(
    userId: Types.ObjectId,
    date: Date,
    role: UserRole
  ): Promise<any[]> {
    try {
      await this.dbService.connect();

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpError(400, "Invalid user ID format");
      }

      // Parse and validate date
      const selectedDate = this.parseAndValidateDate(date);

      // Create date range for the booking day (start and end of day)
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      logger.info("Searching bookings for date range", {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        userId,
        role,
      });

      if (role === UserRole.Coach) {
        return this.workoutService.getBookingsForUser({ userId, date });
      } else if (role === UserRole.Client) {
        return this.workoutService.getBookingsForUser({ userId, date });
      } else {
        throw new HttpError(403, "Unauthorized access");
      }

      // Get bookings with all necessary populated data

      // Return the raw booking data with all field
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching user bookings for day", error as Error);
      throw new HttpError(500, "Failed to fetch bookings for day");
    }
  }

  /**
   * Helper method to parse and validate date
   */
  private parseAndValidateDate(date: string | Date): Date {
    let parsedDate: Date;

    // Parse date if it's a string
    if (typeof date === "string") {
      // If date is just a day number
      if (/^\d+$/.test(date)) {
        const today = new Date();
        parsedDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          parseInt(date)
        );
      }
      // If it's in YYYY-MM-DD format
      else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-").map(Number);
        parsedDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
      }
      // Try standard date parsing
      else {
        parsedDate = new Date(date);
      }
    } else {
      parsedDate = new Date(date);
    }

    // Validate date is valid
    if (isNaN(parsedDate.getTime())) {
      throw new HttpError(400, "Invalid date format");
    }

    logger.info("Parsed date", {
      input: date,
      parsed: parsedDate.toISOString(),
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1,
      day: parsedDate.getDate(),
    });

    return parsedDate;
  }
}
