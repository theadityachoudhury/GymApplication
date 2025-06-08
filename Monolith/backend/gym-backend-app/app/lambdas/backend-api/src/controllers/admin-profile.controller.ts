import { UserService } from "@/services/user.service";
import { logger } from "@/services/logger.service";
import HttpError from "@/utils/http-error";
import { adminPreferenceSchema } from "@/schemas/admin_preference.schema";

export class AdminProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get the current admin's profile
   */
  async getMyProfile(cognitoId: string): Promise<any> {
    try {
      logger.info("Getting admin profile", { cognitoId });
      return await this.userService.getUserProfileByCognitoId(cognitoId);
    } catch (error) {
      logger.error("Error getting admin profile", error as Error);
      throw error;
    }
  }

  /**
   * Get any user profile by ID (admin has full access)
   */
  async getUserProfile(userId: string): Promise<any> {
    try {
      logger.info("Admin getting user profile", { userId });
      return await this.userService.getUserProfileById(userId);
    } catch (error) {
      logger.error("Error getting user profile", error as Error);
      throw error;
    }
  }

}
