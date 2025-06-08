import { CognitoService } from '@/services/cognito.service';
import { logger } from '@/services/logger.service';
import HttpError from '@/utils/http-error';
import { z } from 'zod';

// Schema for password change validation
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export class PasswordController {
    private cognitoService: CognitoService;

    constructor() {
        this.cognitoService = new CognitoService();
    }

    /**
     * Change user password
     * @param accessToken Current valid access token
     * @param body Request body containing current and new password
     */
    async changePassword(accessToken: string, body: unknown): Promise<void> {
        try {
            logger.info('Processing password change request');

            // Validate request body
            const validatedData = passwordChangeSchema.parse(body);

            // Check that new password is different from current password
            if (validatedData.currentPassword === validatedData.newPassword) {
                throw new HttpError(400, 'New password must be different from current password');
            }

            // Call Cognito service to change password
            await this.cognitoService.changePassword(
                accessToken,
                validatedData.currentPassword,
                validatedData.newPassword
            );

            logger.info('Password changed successfully');
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Password validation failed', { errors: error.errors });
                throw new HttpError(400, 'Validation failed', error.errors);
            }

            if (error instanceof HttpError) {
                throw error;
            }

            logger.error('Unexpected error during password change', error as Error);
            throw new HttpError(500, 'Failed to change password');
        }
    }
}