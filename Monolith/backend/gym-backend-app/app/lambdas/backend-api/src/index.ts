import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { logger } from './services/logger.service';
import { DatabaseService } from './services/database.service';
import { formatJSONResponse } from './utils/api-response';
import { corsHeaders } from './utils/cors';
import { requestLoggerMiddleware } from './middleware/logger.middleware';
import { routeRequest } from './routes/router';

// Initialize database connection outside the handler
const dbService = DatabaseService.getInstance();
let isConnected = false;

// Main handler function
const mainHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // Set request ID as context for all logs in this request
    const requestId = event.requestContext?.requestId || context.awsRequestId;
    logger.setContext(`RequestId:${requestId}`);

    // Connect to database if not already connected
    if (!isConnected) {
        try {
            await dbService.connect();
            isConnected = true;
            logger.info('Database connection established');
        } catch (error) {
            logger.error('Failed to connect to database', error as Error);
            // Continue execution even if DB connection fails
        }
    }

    // Handle OPTIONS requests (preflight requests)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        return await routeRequest(event, context);
    } catch (error) {
        logger.error('Unhandled error in request processing', error as Error);

        return formatJSONResponse(500, {
            status: 'error',
            message: 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        });
    }
};

// Apply the logger middleware to the main handler
export const handler = requestLoggerMiddleware(mainHandler);