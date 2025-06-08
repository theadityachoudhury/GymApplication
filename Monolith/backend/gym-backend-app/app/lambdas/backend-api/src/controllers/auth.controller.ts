import { ZodError } from "zod";
import { UserService } from "@/services/user.service";
import { CognitoService } from "@/services/cognito.service";
import HttpError from "@/utils/http-error";
import { parseCookies } from "@/utils/cookies";
import {
  confirmSignupSchema,
  loginSchema,
  refreshTokenSchema,
  resendConfirmationSchema,
  signupSchema,
} from "@/schemas/auth.schemas";
import { determineUserRole } from "@/utils/user-role";
import { logger } from "@/services/logger.service";

export class AuthController {
  private cognitoService: CognitoService;
  private userService: UserService;

  constructor() {
    this.cognitoService = new CognitoService();
    this.userService = new UserService();
  }

  async login(body: unknown): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }> {
    try {
      const validatedData = loginSchema.parse(body);
      return await this.cognitoService.login(
        validatedData.email,
        validatedData.password
      );
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new HttpError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  }

  async signup(body: unknown): Promise<{
    userSub: string;
    userConfirmed: boolean;
  }> {
    let cognitoResult: { userSub: string; userConfirmed: boolean } | null =
      null;
    try {
      // Validate input data
      const validatedData = signupSchema.parse(body);

      // Assign role based on email
      const assignedRole = await determineUserRole(validatedData.email);

      // Register user in Cognito
      cognitoResult = await this.cognitoService.signUp(
        validatedData.email,
        validatedData.password,
        validatedData.firstName,
        validatedData.lastName,
        assignedRole
      );

      // Store additional user data in MongoDB
      await this.userService.createUser({
        cognitoId: cognitoResult.userSub,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        preferableActivity: validatedData.preferableActivity,
        target: validatedData.target,
        role: assignedRole,
      });
      await this.cognitoService.adminConfirmUserInCognito(validatedData.email);

      return cognitoResult;
    } catch (error: unknown) {
      if (cognitoResult?.userSub) {
        try {
          await this.cognitoService.deleteUser(cognitoResult.userSub);
          logger.info(
            `Deleted Cognito user ${cognitoResult.userSub} after MongoDB user creation failed`
          );
        } catch (deleteError: Error | any) {
          logger.error(
            `Failed to delete Cognito user ${cognitoResult.userSub} after MongoDB error:`,
            deleteError
          );
          // We don't throw here as we want to propagate the original error
        }
      }

      if (error instanceof ZodError) {
        throw new HttpError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  }

  async refreshToken(
    body: unknown,
    cookies: string | undefined
  ): Promise<{
    idToken: string;
    accessToken: string;
    expiresIn?: number;
  }> {
    try {
      // First try to get refresh token from body
      const validatedData = refreshTokenSchema.parse(body);

      // If not in body, try to get from cookies
      let refreshToken = validatedData.refreshToken;

      if (!refreshToken && cookies) {
        const parsedCookies = parseCookies(cookies);
        refreshToken = parsedCookies.refreshToken;
      }

      if (!refreshToken) {
        throw new HttpError(400, "Refresh token is required");
      }

      return await this.cognitoService.refreshToken(refreshToken);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new HttpError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  }

  async confirmSignup(confirmationData: unknown): Promise<any> {
    try {
      // Validate and parse input
      const validatedData = confirmSignupSchema.parse(confirmationData);

      // Call service method with validated data
      return this.cognitoService.confirmSignUp(
        validatedData.email,
        validatedData.confirmationCode
      );
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod validation error
        throw new HttpError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  }

  async resendConfirmationCode(body: unknown): Promise<void> {
    try {
      const validatedData = resendConfirmationSchema.parse(body);
      await this.cognitoService.resendConfirmationCode(validatedData.email);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new HttpError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  }
}
