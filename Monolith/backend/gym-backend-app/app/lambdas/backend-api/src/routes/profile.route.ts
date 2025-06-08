import { APIGatewayProxyResult, Context } from "aws-lambda";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserRole } from "../models/user.model";
import { formatJSONResponse } from "@/utils/api-response";
import { handleGetClientProfile } from "@/handlers/client-profile.handler";
import { handleGetCoachProfile } from "@/handlers/coach-profile.handler";
import { handleGetAdminProfile } from "@/handlers/admin-profile.handler";
import {
  handleUpdateClientProfile,
  handleUpdateCoachProfile,
  handleUpdateAdminProfile
} from "@/handlers/profile-update.handler";
import { logger } from "@/services/logger.service";

// Generic profile handler that routes based on user role
export const handleGenericProfile = async (
  event: AuthenticatedRequest,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!event.user) {
    return formatJSONResponse(401, {
      status: "error",
      message: "Authentication required",
    });
  }

  logger.info(`Processing ${event.httpMethod} request for user role: ${event.user.role}`);

  if (event.httpMethod === "GET") {
    // Handle GET requests (retrieve profile)
    switch (event.user.role) {
      case UserRole.Client:
        return handleGetClientProfile(event);
      case UserRole.Coach:
        return handleGetCoachProfile(event);
      case UserRole.Admin:
        return handleGetAdminProfile(event);
      default:
        return formatJSONResponse(400, {
          status: "error",
          message: "Unknown user role",
        });
    }
  } else if (event.httpMethod === "PUT") {
    // Handle PUT requests (update profile)
    switch (event.user.role) {
      case UserRole.Client:
        return handleUpdateClientProfile(event);
      case UserRole.Coach:
        return handleUpdateCoachProfile(event);
      case UserRole.Admin:
        return handleUpdateAdminProfile(event);
      default:
        return formatJSONResponse(400, {
          status: "error",
          message: "Unknown user role",
        });
    }
  }

  return formatJSONResponse(405, {
    status: "error",
    message: "Method not allowed",
  });
};