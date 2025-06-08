import { APIGatewayProxyResult } from 'aws-lambda';
import { ProfileUpdateController } from '@/controllers/profile-update.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { formatJSONResponse, formatErrorResponse } from '@/utils/api-response';
import { logger } from '@/services/logger.service';

/**
 * Handler for updating client profile
 */
export const handleUpdateClientProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Client profile update request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
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

        // Parse request body
        const body = JSON.parse(event.body);

        // Process profile update
        const controller = new ProfileUpdateController();
        const updatedProfile = await controller.updateClientProfile(event.user.cognitoId, body);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        logger.error('Error handling client profile update request', error as Error);
        return formatErrorResponse(error);
    }
};

/**
 * Handler for updating coach profile
 */
export const handleUpdateCoachProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Coach profile update request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
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

        // Parse request body
        const body = JSON.parse(event.body);

        // Process profile update
        const controller = new ProfileUpdateController();
        const updatedProfile = await controller.updateCoachProfile(event.user.cognitoId, event.user.userId!, body);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        logger.error('Error handling coach profile update request', error as Error);
        return formatErrorResponse(error);
    }
};

/**
 * Handler for updating admin profile
 */
export const handleUpdateAdminProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Admin profile update request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
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

        // Parse request body
        const body = JSON.parse(event.body);

        // Process profile update
        const controller = new ProfileUpdateController();
        const updatedProfile = await controller.updateAdminProfile(event.user.cognitoId, body);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        logger.error('Error handling admin profile update request', error as Error);
        return formatErrorResponse(error);
    }
};