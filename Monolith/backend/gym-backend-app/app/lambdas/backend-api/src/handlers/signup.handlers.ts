import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthController } from '../controllers/auth.controller';
import { formatErrorResponse, formatJSONResponse } from '@/utils/api-response';

export const handleSignup = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Missing request body'
            });
        }

        const body = JSON.parse(event.body);
        const authController = new AuthController();
        const result = await authController.signup(body);

        return formatJSONResponse(201, {
            status: 'success',
            message: 'Signup successful',
        });
    } catch (error) {
        return formatErrorResponse(error);
    }
};