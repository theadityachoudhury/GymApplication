import { APIGatewayProxyResult } from 'aws-lambda';
import { CoachProfileController } from '@/controllers/coach-profile.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { formatJSONResponse, formatErrorResponse } from '@/utils/api-response';
import { logger } from '@/services/logger.service';

/**
 * Handler for getting the coach's own profile
 */
export const handleGetCoachProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Coach profile request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        const controller = new CoachProfileController();
        const profile = await controller.getMyProfile(event.user.cognitoId);

        return formatJSONResponse(200, {
            status: 'success',
            data: profile
        });
    } catch (error) {
        logger.error('Error handling coach profile request', error as Error);
        return formatErrorResponse(error);
    }
};

/**
 * Handler for getting a client's profile (coach access)
 */
export const handleGetClientProfileByCoach = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Coach requesting client profile');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        // Get client ID from path parameters
        const clientId = event.pathParameters?.clientId;

        if (!clientId) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Client ID is required'
            });
        }

        const controller = new CoachProfileController();
        const clientProfile = await controller.getClientProfile(clientId);

        return formatJSONResponse(200, {
            status: 'success',
            data: clientProfile
        });
    } catch (error) {
        logger.error('Error handling coach request for client profile', error as Error);
        return formatErrorResponse(error);
    }
};

/**
 * Handler for updating coach profile
 */
export const handleUpdateCoachProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Update coach profile request received');

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

        const profileData = JSON.parse(event.body);
        const controller = new CoachProfileController();
        const updatedProfile = await controller.updateProfile(event.user.cognitoId, profileData);

        return formatJSONResponse(200, {
            status: 'success',
            data: updatedProfile
        });
    } catch (error) {
        logger.error('Error handling update coach profile request', error as Error);
        return formatErrorResponse(error);
    }
};