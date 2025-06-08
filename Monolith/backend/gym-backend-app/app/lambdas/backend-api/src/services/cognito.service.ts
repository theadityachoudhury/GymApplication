// Add this import at the top
import { AWS_REGION } from "@/config/constant";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  InitiateAuthRequest,
  SignUpRequest,
  NotAuthorizedException,
  UserNotConfirmedException,
  UsernameExistsException,
  ConfirmSignUpCommand,
  AdminDeleteUserCommand,
  ResendConfirmationCodeCommand,
  AdminConfirmSignUpCommand,
  ChangePasswordCommand,
  InvalidPasswordException,
  LimitExceededException,
} from "@aws-sdk/client-cognito-identity-provider";
import { logger } from "./logger.service";
import HttpError from "@/utils/http-error";
import { UserRole } from "@/models/user.model";

export class CognitoService {
  private cognito: CognitoIdentityProviderClient;
  private clientId: string;
  private userPoolId: string;

  constructor() {
    this.cognito = new CognitoIdentityProviderClient({ region: AWS_REGION });
    this.clientId = process.env.CLIENT_ID || "";
    this.userPoolId = process.env.USER_POOL_ID || "";

    if (!this.userPoolId || !this.clientId) {
      throw new Error("Cognito configuration is missing");
    }
    // Set context for all logs from this service
    logger.setContext("CognitoService");
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }> {
    try {
      logger.info(`Attempting login for user`, { email });

      const params: InitiateAuthRequest = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      };

      const command = new InitiateAuthCommand(params);
      const result = await this.cognito.send(command);

      if (!result.AuthenticationResult) {
        logger.warn(`Authentication failed for user`, { email });
        throw new HttpError(401, "Authentication failed");
      }

      logger.info(`Login successful for user`, { email });

      return {
        idToken: result.AuthenticationResult.IdToken!,
        accessToken: result.AuthenticationResult.AccessToken!,
        refreshToken: result.AuthenticationResult.RefreshToken,
        expiresIn: result.AuthenticationResult.ExpiresIn,
      };
    } catch (error: any) {
      logger.error(`Login error for user`, error, {
        email,
        errorCode: error.name,
      });

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof NotAuthorizedException) {
        throw new HttpError(401, "Incorrect username or password");
      }

      if (error instanceof UserNotConfirmedException) {
        throw new HttpError(403, "User is not confirmed");
      }

      throw new HttpError(
        500,
        "Login failed: " + (error.message || "Unknown error")
      );
    }
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ): Promise<{
    userSub: string;
    userConfirmed: boolean;
  }> {
    try {
      const params: SignUpRequest = {
        ClientId: this.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "given_name",
            Value: firstName,
          },
          {
            Name: "family_name",
            Value: lastName,
          },
          {
            Name: "custom:role",
            Value: role
          }
        ],
      };

      const command = new SignUpCommand(params);
      const result = await this.cognito.send(command);

      return {
        userSub: result.UserSub!,
        userConfirmed: result.UserConfirmed || false,
      };
    } catch (error: any) {
      logger.error("Cognito signup error:", error);

      if (error instanceof UsernameExistsException) {
        throw new HttpError(409, "User already exists");
      }

      throw new HttpError(
        500,
        "Signup failed: " + (error.message || "Unknown error")
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    idToken: string;
    accessToken: string;
    expiresIn?: number;
  }> {
    try {
      const params: InitiateAuthRequest = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      };

      const command = new InitiateAuthCommand(params);
      const result = await this.cognito.send(command);

      if (!result.AuthenticationResult) {
        throw new HttpError(401, "Token refresh failed");
      }

      return {
        idToken: result.AuthenticationResult.IdToken!,
        accessToken: result.AuthenticationResult.AccessToken!,
        expiresIn: result.AuthenticationResult.ExpiresIn,
      };
    } catch (error: any) {
      logger.error("Cognito refresh token error:", error);

      if (error instanceof NotAuthorizedException) {
        throw new HttpError(401, "Invalid refresh token");
      }

      throw new HttpError(
        500,
        "Token refresh failed: " + (error.message || "Unknown error")
      );
    }
  }

  async confirmSignUp(email: string, confirmationCode: string): Promise<any> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
      });

      await this.cognito.send(command);

      return {
        message: "User confirmed successfully",
      };
    } catch (error: any) {
      logger.error("Cognito Confirm SignUp Error:", error);

      if (error.name === "CodeMismatchException") {
        throw new HttpError(400, "Invalid verification code");
      }

      if (error.name === "ExpiredCodeException") {
        throw new HttpError(400, "Verification code has expired");
      }

      throw new HttpError(500, error.message || "Error during confirmation");
    }
  }
  // Add similar logging to other methods...
  async deleteUser(userSub: string): Promise<void> {
    try {
      const params = {
        Username: userSub,
        UserPoolId: this.clientId, // This should be the User Pool ID, not the Client ID
      };

      await this.cognito.send(new AdminDeleteUserCommand(params));
      logger.info(`Successfully deleted user ${userSub} from Cognito`);
    } catch (error: any) {
      logger.error("Error deleting user from Cognito:", error);
      throw new HttpError(500, "Failed to delete user from Cognito", {
        originalError: error,
      });
    }
  }

  async resendConfirmationCode(email: string): Promise<void> {
    try {
      logger.info(`Resending confirmation code for user`, { email });

      const command = new ResendConfirmationCodeCommand({
        ClientId: this.clientId,
        Username: email,
      });

      await this.cognito.send(command);

      logger.info(`Confirmation code resent successfully for user`, { email });
    } catch (error: any) {
      logger.error(`Error resending confirmation code for user`, error, {
        email,
        errorName: error.name,
      });

      if (error.name === "UserNotFoundException") {
        throw new HttpError(404, "User not found");
      }

      if (error.name === "InvalidParameterException") {
        throw new HttpError(400, "Invalid parameters");
      }

      if (error.name === "LimitExceededException") {
        throw new HttpError(429, "Too many requests. Please try again later.");
      }

      if (error.name === "NotAuthorizedException") {
        throw new HttpError(400, "User is already confirmed");
      }

      throw new HttpError(
        500,
        "Failed to resend confirmation code: " +
        (error.message || "Unknown error")
      );
    }
  }

  async adminConfirmUserInCognito(email: string) {
    try {
      logger.info("Attempting to auto-verify user with admin privileges", {
        email,
      });

      const command = new AdminConfirmSignUpCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      await this.cognito.send(command);
      logger.info("User auto-verified successfully", { email });
    } catch (error) {
      logger.error("Error in adminConfirmUserInCognito", error as Error);
      throw error;
    }
  }


  async changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      logger.info('Changing user password');

      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword
      });

      await this.cognito.send(command);

      logger.info('Password changed successfully');
    } catch (error: any) {
      logger.error('Error changing password', error);

      if (error instanceof NotAuthorizedException) {
        throw new HttpError(401, 'Incorrect current password');
      }

      if (error instanceof InvalidPasswordException) {
        throw new HttpError(400, 'New password does not meet requirements');
      }

      if (error instanceof LimitExceededException) {
        throw new HttpError(429, 'Too many requests. Please try again later.');
      }

      throw new HttpError(500, 'Failed to change password: ' + (error.message || 'Unknown error'));
    }
  }
}
