import { APIGatewayProxyResult } from 'aws-lambda';
import { ClientProfileController } from '@/controllers/client-profile.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { logger } from '@/services/logger.service';
import { formatErrorResponse, formatJSONResponse } from '@/utils/api-response';

/**
 * Handler for getting the client's own profile
 */
export const handleGetClientProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Client profile request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        const controller = new ClientProfileController();
        const profile = await controller.getMyProfile(event.user.cognitoId);

        return formatJSONResponse(200, {
            status: 'success',
            data: profile
        });
    } catch (error) {
        logger.error('Error handling client profile request', error as Error);
        return formatErrorResponse(error);
    }
};
