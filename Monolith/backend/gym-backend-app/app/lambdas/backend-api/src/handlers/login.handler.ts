
import { AuthController } from '../controllers/auth.controller';
import { setCookie } from '@/utils/cookies';
import { formatErrorResponse, formatJSONResponse } from '@/utils/api-response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handleLogin = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return formatJSONResponse(400, {
                status: 'error',
                message: 'Missing request body'
            });
        }

        const body = JSON.parse(event.body);
        const authController = new AuthController();
        const result = await authController.login(body);

        const cookies = [];

        // Set refresh token as HttpOnly cookie if available
        if (result.refreshToken) {
            cookies.push(setCookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/'
            }));
        }

        // Don't include refresh token in the response body for security
        const { refreshToken, ...tokensToReturn } = result;

        return formatJSONResponse(200, {
            status: 'success',
            message: 'Login successful',
            tokens: tokensToReturn
        }, cookies);
    } catch (error) {
        return formatErrorResponse(error);
    }
};