import { APIGatewayProxyResult } from 'aws-lambda';
import { AdminProfileController } from '@/controllers/admin-profile.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { formatJSONResponse, formatErrorResponse } from '@/utils/api-response';
import { logger } from '@/services/logger.service';

/**
 * Handler for getting the admin's own profile
 */
export const handleGetAdminProfile = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Admin profile request received');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        const controller = new AdminProfileController();
        const profile = await controller.getMyProfile(event.user.cognitoId);

        return formatJSONResponse(200, {
            status: 'success',
            data: profile
        });
    } catch (error) {
        logger.error('Error handling admin profile request', error as Error);
        return formatErrorResponse(error);
    }
};

/**
 * Handler for getting any user's profile (admin access)
 */
export const handleGetUserProfileByAdmin = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Admin requesting user profile');

        // Ensure user is authenticated
        if (!event.user || !event.user.cognitoId) {
            return formatJSONResponse(401, {
                status: 'error',
                message: 'Authentication required'
            });
        }

        // Get user ID from path parameters
        const userId = event.pathParameters?.userId;

        if (!userId) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'User ID is required'
            });
        }

        const controller = new AdminProfileController();
        const userProfile = await controller.getUserProfile(userId);

        return formatJSONResponse(200, {
            status: 'success',
            data: userProfile
        });
    } catch (error) {
        logger.error('Error handling admin request for user profile', error as Error);
        return formatErrorResponse(error);
    }
};

