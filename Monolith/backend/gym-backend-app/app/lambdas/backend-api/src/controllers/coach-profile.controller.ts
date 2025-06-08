import { UserService } from "@/services/user.service";
import { logger } from "@/services/logger.service";
import HttpError from "@/utils/http-error";
import { coachPreferenceSchema } from "@/schemas/coach_preference.schema";

export class CoachProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get the current coach's profile
   */
  async getMyProfile(cognitoId: string): Promise<any> {
    try {
      logger.info("Getting coach profile", { cognitoId });
      return await this.userService.getUserProfileByCognitoId(cognitoId);
    } catch (error) {
      logger.error("Error getting coach profile", error as Error);
      throw error;
    }
  }

  /**
   * Get client profile by ID (coach can view their clients)
   */
  async getClientProfile(clientId: string): Promise<any> {
    try {
      logger.info("Coach getting client profile", { clientId });
      return await this.userService.getUserProfileById(clientId);
    } catch (error) {
      logger.error("Error getting client profile", error as Error);
      throw error;
    }
  }
}
