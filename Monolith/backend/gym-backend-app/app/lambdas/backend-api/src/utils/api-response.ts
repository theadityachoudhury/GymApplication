import { APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';
import { corsHeaders } from './cors';
import { logger } from '../services/logger.service';
import HttpError from './http-error';

export const formatJSONResponse = (
    statusCode: number,
    body: any,
    cookies?: string[]
): APIGatewayProxyResult => {
    const response: APIGatewayProxyResult = {
        statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    if (cookies && cookies.length > 0) {
        response.multiValueHeaders = {
            'Set-Cookie': cookies
        };
    }

    return response;
};

export const formatErrorResponse = (error: any): APIGatewayProxyResult => {
    // Log the error
    if (error instanceof HttpError) {
        logger.warn(`HTTP Exception: ${error.message}`, {
            status: error.status,
            details: error.details
        });
    } else if (error instanceof ZodError) {
        logger.warn('Validation Error', {
            errors: error.errors
        });
    } else {
        logger.error('Unhandled Error', error);
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return formatJSONResponse(400, {
            status: 'error',
            message: 'Validation failed',
            details: error.errors
        });
    }

    // Handle custom HTTP exceptions
    if (error instanceof HttpError) {
        return formatJSONResponse(error.status, {
            status: 'error',
            message: error.message,
            ...(error.details && { details: error.details })
        });
    }

    // Handle other errors
    return formatJSONResponse(500, {
        status: 'error',
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};