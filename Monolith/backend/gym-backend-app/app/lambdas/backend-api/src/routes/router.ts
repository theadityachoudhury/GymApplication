import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  authMiddleware,
  roleMiddleware,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { UserRole } from "../models/user.model";
import {
  handleGetAdminProfile,
  handleGetUserProfileByAdmin
} from '../handlers/admin-profile.handler';
import { formatJSONResponse } from '@/utils/api-response';
import { handleSignup } from '@/handlers/signup.handlers';
import { handleLogin } from '@/handlers/login.handler';
import { handleSignupConfirm } from '@/handlers/singup-confirm.handler';
import { handleResendConfirmation } from '@/handlers/resend-cofirmcode.handler';
import { handleRefreshToken } from '@/handlers/refresh-token.handler';
import { handleGenericProfile } from './profile.route';
import { logger } from '@/services/logger.service';
import { getFilteredCoachesHandler } from '@/handlers/coachWorkoutFilter.handler';
import { createWorkoutOption, getWorkoutOptions } from '@/handlers/workout_option.handler';
import { handleWorkoutMapping } from '@/handlers/workout.handler';
import {
  handleGetCoachProfile,
  handleGetClientProfileByCoach,
  handleUpdateCoachProfile,
} from "../handlers/coach-profile.handler";
import { handleWorkoutBooking } from "@/handlers/workoutBooking.handler";
import { handleWorkoutCancellation } from "@/handlers/workoutCancellation.handler";
import { handleGetUserBookings } from "@/handlers/UserWorkoutBookings.handler";
import {
  handleGetAllCoaches,
  handleGetCoachById,
  handleGetCoachTimeSlots,
  handleGetUserDayBookings,
} from "@/handlers/coach.handler";
import {
  handleAddFeedback,
  handleGetCoachFeedback,
} from "@/handlers/feedback.handler";
import { handleChangePassword } from "@/handlers/password.handler";
import { handleGetClientProfile } from "@/handlers/client-profile.handler";
import { handleUpdateAdminProfile, handleUpdateClientProfile } from "@/handlers/profile-update.handler";
import { handleUploadProfileImage } from "@/handlers/image-upload.handler";

// Helper function to create a route handler with authentication and role checks
const createProtectedRoute = (
  handler: (
    event: AuthenticatedRequest,
    context: Context
  ) => Promise<APIGatewayProxyResult>,
  roles: UserRole[]
) => {
  logger.info("creating the protected route");
  return authMiddleware(roleMiddleware(roles)(handler));
};

export const routeRequest = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const path = event.path;
  const method = event.httpMethod;

  // logger.setContext(context);
  logger.info("event", event);

  if (path === "/hello") {
    return formatJSONResponse(201, {
      status: "success",
      message: "Hello world",
    });
  }

  if (path === "/auth/sign-up" && method === "POST") {
    return await handleSignup(event);
  }
  if (path === "/auth/sign-up" && method === "POST") {
    return await handleSignup(event);
  }

  if (path === "/auth/sign-in" && method === "POST") {
    return await handleLogin(event);
  }

  if (path === "/auth/confirm" && method === "POST") {
    return await handleSignupConfirm(event);
  }

  if (path === "/auth/resend-confirmation" && method === "POST") {
    return await handleResendConfirmation(event);
  }

  if (path === "/auth/refresh-token" && method === "POST") {
    return await handleRefreshToken(event);
  }

  // Generic profile route
  if (path === "/profile") {
    return await authMiddleware(handleGenericProfile)(event, context);
  }

  // Client profile route
  if (path === "/client/profile") {
    if (method === "GET") {
      return await createProtectedRoute(handleGetClientProfile, [UserRole.Client])(event, context);
    } else if (method === "PUT") {
      return await createProtectedRoute(handleUpdateClientProfile, [UserRole.Client])(event, context);
    }
  }

  // Coach profile route
  if (path === "/coach/profile") {
    if (method === "GET") {
      return await createProtectedRoute(handleGetCoachProfile, [UserRole.Coach])(event, context);
    } else if (method === "PUT") {
      return await createProtectedRoute(handleUpdateCoachProfile, [UserRole.Coach])(event, context);
    }
  }

  // Admin profile route
  if (path === "/admin/profile") {
    if (method === "GET") {
      return await createProtectedRoute(handleGetAdminProfile, [UserRole.Admin])(event, context);
    } else if (method === "PUT") {
      return await createProtectedRoute(handleUpdateAdminProfile, [UserRole.Admin])(event, context);
    }
  }

  if (path === "/workouts/available" && method === 'GET') {
    return await getFilteredCoachesHandler(event, context);
  }

  if (path === "/workouts/workout-options" && method === 'GET') {
    return await getWorkoutOptions(event);
  }

  if (path === "/workouts" && method === 'POST') {
    return await createProtectedRoute(handleWorkoutBooking, [UserRole.Client])(event, context);
  }

  if (path === "/workouts/bookings" && method === "GET") {
    return await createProtectedRoute(handleGetUserBookings, [
      UserRole.Client,
      UserRole.Coach,
    ])(event, context);
  }

  if (path.match(/^\/workouts\/[^\/]+$/i)) {
    if (event.resource === "/workouts/{bookingId}" && method === "DELETE")
      return await createProtectedRoute(handleWorkoutCancellation, [
        UserRole.Client,
      ])(event, context);
  }

  if (path === "/create-workout" && method === "POST") {
    return await createWorkoutOption(event);
  }

  if (path === "/map-workouts" && method === "POST") {
    return await handleWorkoutMapping(event);
  }

  // Get all coaches (public endpoint)
  if (path === "/coaches" && method === "GET") {
    return await handleGetAllCoaches(event, context);
  }

  // Get specific coach profile (public endpoint)
  if (path.match(/^\/coaches\/[^\/]+$/i) && method === "GET") {
    const coachId = path.split("/").pop();
    if (coachId) {
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.coachId = coachId;
      return await handleGetCoachById(event, context);
    }
  }

  // Get coach available time slots (public endpoint)
  if (path.match(/^\/coaches\/[^\/]+\/time-slots$/i) && method === "GET") {
    const coachId = path.split("/")[2];
    if (coachId) {
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.coachId = coachId;
      return await handleGetCoachTimeSlots(event, context);
    }
  }

  // Get user bookings for a day (protected endpoint)
  if (path === "/bookings/day" && method === "GET") {
    return await createProtectedRoute(handleGetUserDayBookings, [
      UserRole.Client,
      UserRole.Coach,
    ])(event, context);
  }

  // For adding feedback (both client and coach can add feedback)
  if (path === "/feedback" && method === "POST") {
    return await createProtectedRoute(handleAddFeedback, [
      UserRole.Client,
      UserRole.Coach,
    ])(event, context);
  }

  if (path.match(/^\/feedback\/coach\/[^\/]+$/i) && method === "GET") {
    // Extract coach ID from path
    const coachId = path.split("/").pop();
    if (coachId) {
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.coachId = coachId;
      return await handleGetCoachFeedback(event);
    }
  }


  // Coach accessing client profile
  if (path.startsWith("/coach/clients/") && method === "GET") {
    // Extract client ID from path
    const clientId = path.split("/").pop();
    if (clientId) {
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.clientId = clientId;
      return await createProtectedRoute(handleGetClientProfileByCoach, [
        UserRole.Coach,
      ])(event, context);
    }
  }

  // Admin accessing user profile
  if (path.startsWith("/admin/users/") && method === "GET") {
    // Extract user ID from path
    const userId = path.split("/").pop();
    if (userId) {
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.userId = userId;
      return await createProtectedRoute(handleGetUserProfileByAdmin, [
        UserRole.Admin,
      ])(event, context);
    }
  }


  // Client password change route
  if (path === '/client/password' && method === 'PUT') {
    return await createProtectedRoute(handleChangePassword, [UserRole.Client])(event, context);
  }

  // Coach password change route
  if (path === '/coach/password' && method === 'PUT') {
    return await createProtectedRoute(handleChangePassword, [UserRole.Coach])(event, context);
  }



  if (path === "/profile/image" && method === "PUT") {
    return await authMiddleware(handleUploadProfileImage)(event, context);
  }
  return formatJSONResponse(404, { status: "error", message: "Not Found" });
};
