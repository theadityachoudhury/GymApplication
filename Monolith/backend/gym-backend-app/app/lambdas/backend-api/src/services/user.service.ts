import {
  Admin,
  BaseUser,
  Client,
  Coach,
  User,
  UserRole,
} from "@/models/user.model";
import { DatabaseService } from "./database.service";
import { UserPreferableActivity, UserTarget } from "@/schemas/auth.schemas";
import HttpError from "@/utils/http-error";
import { logger } from "./logger.service";
import { getUserCreator } from "@/utils/user-role";
import mongoose from "mongoose";
import { clientPreferenceSchema } from "@/schemas/client_preference.schema";
import { coachPreferenceSchema } from "@/schemas/coach_preference.schema";
import { adminPreferenceSchema } from "@/schemas/admin_preference.schema";
import { AdminDataModel, ClientDataModel, CoachDataModel } from "@/models";
import { z } from "zod";

type ClientPreferenceData = z.infer<typeof clientPreferenceSchema>;
type CoachPreferenceData = z.infer<typeof coachPreferenceSchema>;
type AdminPreferenceData = z.infer<typeof adminPreferenceSchema>;

export class UserService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async createUser(userData: {
    cognitoId: string;
    email: string;
    firstName: string;
    lastName: string;
    preferableActivity: UserPreferableActivity;
    target: UserTarget;
    role: UserRole;
  }): Promise<BaseUser> {
    try {
      await this.dbService.connect();

      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { cognitoId: userData.cognitoId }],
      });

      if (existingUser) {
        throw new HttpError(409, "User already exists in database");
      }

      const createdUser = await getUserCreator(userData.role, userData);
      return createdUser;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error("Error creating user in database:", error as Error);
      throw new HttpError(500, "Failed to create user in database");
    }
  }

  async getUserByCognitoId(cognitoId: string): Promise<BaseUser | null> {
    try {
      // Ensure database connection
      await this.dbService.connect();

      return await User.findOne({ cognitoId });
    } catch (error) {
      logger.error("Error fetching user by Cognito ID:", error as Error);
      throw new HttpError(500, "Failed to fetch user from database");
    }
  }

  async getUserByEmail(email: string): Promise<BaseUser | null> {
    try {
      // Ensure database connection
      await this.dbService.connect();

      return await User.findOne({ email });
    } catch (error) {
      logger.error("Error fetching user by email:", error as Error);
      throw new HttpError(500, "Failed to fetch user from database");
    }
  }

  async getUserProfileByCognitoId(cognitoId: string): Promise<any> {
    try {
      logger.info("Fetching user profile", { cognitoId });

      // Find the base user first
      const baseUser = await User.findOne({ cognitoId });

      if (!baseUser) {
        logger.warn("User not found", { cognitoId });
        throw new HttpError(404, "User not found");
      }



      // Based on the role, fetch additional data
      switch (baseUser.role) {
        case UserRole.Client:
          return this.getClientProfile(baseUser);
        case UserRole.Coach:
          return this.getCoachProfile(baseUser);
        case UserRole.Admin:
          return this.getAdminProfile(baseUser);
        default:
          logger.warn("Unknown user role", { role: baseUser.role, cognitoId });
          throw new HttpError(400, "Unknown user role");
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching user profile", error as Error);
      throw new HttpError(500, "Failed to fetch user profile");
    }
  }

  /**
   * Get client profile with client-specific data
   */
  async getClientProfile(baseUser: BaseUser): Promise<any> {
    try {
      // Use the discriminator to get the full Client document
      const clientUser = await Client.findById(baseUser._id);

      if (!clientUser || !clientUser.clientId) {
        logger.warn("Client data not found", { userId: baseUser._id });
        throw new HttpError(404, "Client data not found");
      }

      // Fetch client details
      const clientData = await ClientDataModel.findById(clientUser.clientId);

      if (!clientData) {
        logger.warn("Client details not found", {
          clientId: clientUser.clientId,
        });
        throw new HttpError(404, "Client details not found");
      }

      // Return combined profile
      return {
        id: clientUser._id,
        cognitoId: clientUser.cognitoId,
        firstName: clientUser.firstName,
        lastName: clientUser.lastName,
        email: clientUser.email,
        role: clientUser.role,
        gym: clientUser.gym,
        image: clientUser.image,
        target: clientData.target,
        preferredActivity: clientData.preferredActivity,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching client profile", error as Error);
      throw new HttpError(500, "Failed to fetch client profile");
    }
  }

  /**
   * Get coach profile with coach-specific data
   */
  async getCoachProfile(baseUser: BaseUser): Promise<any> {
    try {
      // Use the discriminator to get the full Coach document
      const coachUser = await Coach.findById(baseUser._id);

      if (!coachUser || !coachUser.coachId) {
        logger.warn("Coach data not found", { userId: baseUser._id });
        throw new HttpError(404, "Coach data not found");
      }

      // Fetch coach details with populated specializations and certificates
      const coachData = await CoachDataModel.findById(coachUser.coachId)
        .populate("specialization")
        .populate("certificates");

      if (!coachData) {
        logger.warn("Coach details not found", { coachId: coachUser.coachId });
        throw new HttpError(404, "Coach details not found");
      }

      // Return combined profile
      return {
        id: coachUser._id,
        cognitoId: coachUser.cognitoId,
        firstName: coachUser.firstName,
        lastName: coachUser.lastName,
        email: coachUser.email,
        role: coachUser.role,
        gym: coachUser.gym,
        image: coachUser.image,
        specialization: coachData.specialization.map((spec) => ({
          label: spec.name,
          value: spec._id.toString(),
        })),
        title: coachData.title,
        about: coachData.about,
        rating: coachData.rating,
        certificates: coachData.certificates,
        workingDays: coachData.workingDays,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching coach profile", error as Error);
      throw new HttpError(500, "Failed to fetch coach profile");
    }
  }

  /**
   * Get admin profile with admin-specific data
   */
  async getAdminProfile(baseUser: BaseUser): Promise<any> {
    try {
      // Use the discriminator to get the full Admin document
      const adminUser = await Admin.findById(baseUser._id);

      if (!adminUser || !adminUser.adminId) {
        logger.warn("Admin data not found", { userId: baseUser._id });
        throw new HttpError(404, "Admin data not found");
      }

      // Fetch admin details
      const adminData = await AdminDataModel.findById(adminUser.adminId);

      if (!adminData) {
        logger.warn("Admin details not found", { adminId: adminUser.adminId });
        throw new HttpError(404, "Admin details not found");
      }

      // Return combined profile
      return {
        id: adminUser._id,
        cognitoId: adminUser.cognitoId,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role,
        image: adminUser.image,
        phoneNumber: adminData.phoneNumber,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching admin profile", error as Error);
      throw new HttpError(500, "Failed to fetch admin profile");
    }
  }

  /**
   * Get user profile by ID with role-specific data
   */
  async getUserProfileById(userId: string): Promise<any> {
    try {
      logger.info("Fetching user profile by ID", { userId });

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpError(400, "Invalid user ID format");
      }

      // Find the base user first
      const baseUser = await User.findById(userId);

      if (!baseUser) {
        logger.warn("User not found", { userId });
        throw new HttpError(404, "User not found");
      }

      // Based on the role, fetch additional data
      switch (baseUser.role) {
        case UserRole.Client:
          return this.getClientProfile(baseUser);
        case UserRole.Coach:
          return this.getCoachProfile(baseUser);
        case UserRole.Admin:
          return this.getAdminProfile(baseUser);
        default:
          logger.warn("Unknown user role", { role: baseUser.role, userId });
          throw new HttpError(400, "Unknown user role");
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error("Error fetching user profile by ID", error as Error);
      throw new HttpError(500, "Failed to fetch user profile");
    }
  }
}
