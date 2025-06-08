import { APIGatewayProxyResult } from 'aws-lambda';
import { ImageUploadController } from '@/controllers/image-upload.controller';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { formatJSONResponse, formatErrorResponse } from '@/utils/api-response';
import { logger } from '@/services/logger.service';

/**
 * Handler for uploading profile image
 */
export const handleUploadProfileImage = async (event: AuthenticatedRequest): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Profile image upload request received');

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

        // Process image upload
        const controller = new ImageUploadController();
        const result = await controller.uploadProfileImage(event.user.cognitoId, body);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Profile image uploaded successfully',
            data: result
        });
    } catch (error) {
        logger.error('Error handling profile image upload request', error as Error);
        return formatErrorResponse(error);
    }
};