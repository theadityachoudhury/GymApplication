import { logger } from "@/services/logger.service";
import { WorkoutService } from "@/services/workout.service";
import HttpError from "@/utils/http-error";
import { Types } from "mongoose";
import { z, ZodError } from "zod";

export type bookWorkoutParams = {
  clientId: Types.ObjectId;
  workoutId: Types.ObjectId;
  coachId: Types.ObjectId;
  timeSlotId: Types.ObjectId;
  date: Date;
}

const workoutFilterSchema = z.object({
  workoutId: z.string().optional(),
  coachId: z.string().optional(),
  timeSlotId: z.string().optional(),
  date: z.date().optional(),
})
export class WorkoutMapperController {
  private service: WorkoutService;

  constructor() {
    this.service = new WorkoutService();
  }

  async mapWorkoutsToCoach(coachId: string, workoutIds: string[]) {
    return this.service.createMappings(coachId, workoutIds);
  }

  async fetchCoachesForWorkout(workoutId: string) {
    return this.service.getCoachesByWorkout(workoutId);
  }

  async bookWorkout({ clientId, workoutId, coachId, timeSlotId, date }: bookWorkoutParams) {
    return await this.service.bookWorkout({ clientId, workoutId, coachId, timeSlotId, date });
  }

  async cancelWorkout({ userId, bookingId }: { userId: Types.ObjectId; bookingId: Types.ObjectId }) {
    return await this.service.cancelBooking({ userId, bookingId });
  }

  async getUserBookings({ userId }: { userId: Types.ObjectId }) {
    return await this.service.getAllBookingsForUser({ userId });
  }

  async create(name: string) {
    return await this.service.createWorkoutOption(name);
  }

  async getAll() {
    return await this.service.getAllWorkoutOptions();
  }


  async getFilteredCoaches(workoutId?: string, coachId?: string, timeSlotId?: string, date?: Date) {
    try {
      const validatedData = workoutFilterSchema.parse({
        workoutId,
        coachId,
        timeSlotId,
        date
      });

      return await this.service.searchWorkoutUsingFilters(validatedData)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error("Zod validation error", error);
        throw new HttpError(400, "Invalid filters", error.errors);
      }

      throw error;
    }
  }

}
