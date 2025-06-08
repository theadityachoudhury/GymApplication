import { UserService } from "@/services/user.service";
import { logger } from "@/services/logger.service";
import HttpError from "@/utils/http-error";
import { clientPreferenceSchema } from "@/schemas/client_preference.schema";
import { ZodError } from "zod";

export class ClientProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get the current client's profile
   */
  async getMyProfile(cognitoId: string): Promise<any> {
    try {
      logger.info("Getting client profile", { cognitoId });
      return await this.userService.getUserProfileByCognitoId(cognitoId);
    } catch (error) {
      logger.error("Error getting client profile", error as Error);
      throw error;
    }
  }
}
