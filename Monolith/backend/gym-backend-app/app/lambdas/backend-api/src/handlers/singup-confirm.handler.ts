import { AuthController } from '@/controllers/auth.controller';
import { confirmSignupSchema } from '@/schemas/auth.schemas';
import { logger } from '@/services/logger.service';
import { corsHeaders } from '@/utils/cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';

export const handleSignupConfirm = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing signup confirmation request');

    try {
        // Check if request body exists
        if (!event.body) {
            logger.warn('Missing request body');
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Missing request body'
                })
            };
        }

        // Parse and validate request body
        const body = JSON.parse(event.body);
        const validatedData = confirmSignupSchema.parse(body);

        const authController = new AuthController();
        const result = await authController.confirmSignup(validatedData);

        logger.info('Signup confirmation successful', { email: validatedData.email });

        // Return success response
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 'success',
                message: 'Email confirmed successfully. You can now log in.'
            })
        };
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            logger.warn('Validation error', { errors: error.errors });
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.errors
                })
            };
        }

        // Handle Cognito errors
        if (error instanceof Error) {
            logger.error('Signup confirmation error', error);

            // Handle specific Cognito errors
            if (error.name === 'CodeMismatchException') {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'Invalid confirmation code'
                    })
                };
            }

            if (error.name === 'ExpiredCodeException') {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'Confirmation code has expired. Please request a new one.'
                    })
                };
            }

            if (error.name === 'UserNotFoundException') {
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'User not found'
                    })
                };
            }

            if (error.name === 'NotAuthorizedException') {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'User is already confirmed'
                    })
                };
            }
        }

        // Handle other errors
        logger.error('Unexpected error during signup confirmation', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 'error',
                message: 'An error occurred while confirming your account'
            })
        };
    }
};
