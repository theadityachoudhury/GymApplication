import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthController } from '../controllers/auth.controller';
import { formatErrorResponse, formatJSONResponse } from '@/utils/api-response';


export const handleRefreshToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const cookieHeader = event.headers.Cookie || event.headers.cookie;

        const authController = new AuthController();
        const result = await authController.refreshToken(body, cookieHeader);

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Token refreshed successfully',
            tokens: result
        });
    } catch (error) {
        return formatErrorResponse(error);
    }
};