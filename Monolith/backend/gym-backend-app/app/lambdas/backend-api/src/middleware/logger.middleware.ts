import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { logger } from '../services/logger.service';

export const requestLoggerMiddleware = (
    handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>
) => {
    return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
        const requestStartTime = Date.now();

        // Log the incoming request
        logger.logApiGatewayRequest(event, context);

        try {
            // Execute the handler
            const response = await handler(event, context);

            // Calculate execution time
            const executionTime = Date.now() - requestStartTime;

            // Log the response
            const requestId = event.requestContext?.requestId || context.awsRequestId;
            logger.logApiGatewayResponse(response, executionTime, requestId);

            return response;
        } catch (error) {
            // Log the error with request context
            logger.logApiGatewayError(error as Error, event, context);

            // Re-throw the error to be handled by error middleware
            throw error;
        }
    };
};