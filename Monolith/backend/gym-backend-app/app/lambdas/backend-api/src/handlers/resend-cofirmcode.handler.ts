import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthController } from '../controllers/auth.controller';
import { logger } from '@/services/logger.service';
import { formatErrorResponse, formatJSONResponse } from '@/utils/api-response';

export const handleResendConfirmation = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            logger.warn('Missing request body');
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Missing request body'
            });
        }

        const body = JSON.parse(event.body);
        const authController = new AuthController();

        await authController.resendConfirmationCode(body);

        logger.info('Confirmation code resent successfully');

        return formatJSONResponse(200, {
            status: 'success',
            message: 'A new confirmation code has been sent to your email'
        });
    } catch (error) {
        return formatErrorResponse(error);
    }
};