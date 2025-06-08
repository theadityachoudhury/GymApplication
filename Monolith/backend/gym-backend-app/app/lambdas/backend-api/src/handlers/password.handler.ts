import { APIGatewayProxyResult } from 'aws-lambda';
import { PasswordController } from '@/controllers/password.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { formatJSONResponse, formatErrorResponse } from '@/utils/api-response';
import { logger } from '@/services/logger.service';

/**
 * Handler for changing user password
 */
export const handleChangePassword = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Password change request received');

        // Ensure user is authenticated
        if (!event.user) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        // Ensure request body exists
        if (!event.body) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Missing request body'
            });
        }

        // Get access token from Authorization header
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Missing Authorization header'
            });
        }

        // Extract the token (remove "Bearer " prefix)
        const accessToken = authHeader.replace('Bearer ', '');

        // Parse request body
        const body = JSON.parse(event.body);

        // Process password change
        const controller = new PasswordController();
        await controller.changePassword(accessToken, body);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Password changed successfully'
        });
    } catch (error) {
        logger.error('Error handling password change request', error as Error);
        return formatErrorResponse(error);
    }
};