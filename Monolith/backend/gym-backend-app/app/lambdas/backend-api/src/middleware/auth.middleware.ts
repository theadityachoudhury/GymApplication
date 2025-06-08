import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { User, UserRole } from '@/models/user.model';
import { logger } from '@/services/logger.service';
import { formatJSONResponse } from '@/utils/api-response';
import { ObjectId } from 'mongoose';

// Interface for the decoded JWT token
interface DecodedToken {
    sub: string;
    username: string;
    'cognito:groups'?: string[];
    [key: string]: any;
}

// Interface for the authenticated request
export interface AuthenticatedRequest extends APIGatewayProxyEvent {
    user?: {
        cognitoId: string;
        email: string;
        role: UserRole;
        userId?: string;
    };
}

// Create a JWT verifier for Cognito
const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID || '',
    tokenUse: 'access',
    clientId: process.env.CLIENT_ID || ''
});

/**
 * Authentication middleware that verifies the JWT token
 * and adds the user information to the request
 */
export const authMiddleware = (
    handler: (event: AuthenticatedRequest, context: Context) => Promise<APIGatewayProxyResult>
) => {
    return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
        try {
            // Get the token from the Authorization header
            const authHeader = event.headers.Authorization || event.headers.authorization;
            logger.info(authHeader!)
            if (!authHeader) {
                logger.warn('Missing Authorization header');
                return formatJSONResponse(401, {
                    status: 'error',
                    message: 'Missing Authorization header'
                });
            }

            // Extract the token (remove "Bearer " prefix)
            const token = authHeader.replace('Bearer ', '');

            try {
                // Verify the token
                const decodedToken: DecodedToken = await verifier.verify(token);
                logger.info(JSON.stringify(decodedToken))
                // Get the Cognito user ID from the token
                const cognitoId = decodedToken.sub;
                const email = decodedToken.username;

                // Find the user in the database
                const user = await User.findOne({ cognitoId });

                if (!user) {
                    logger.warn('User not found in database', { cognitoId });
                    return formatJSONResponse(404, {
                        status: 'error',
                        message: 'User not found'
                    });
                }

                // Add user information to the request
                const authenticatedRequest = event as AuthenticatedRequest;
                authenticatedRequest.user = {
                    cognitoId,
                    email,
                    role: user.role,
                    userId: (user._id as ObjectId).toString()
                };

                // Call the handler with the authenticated request
                return await handler(authenticatedRequest, context);
            } catch (error) {
                logger.error('Token verification failed', error as Error);
                return formatJSONResponse(401, {
                    status: 'error',
                    message: 'Invalid or expired token'
                });
            }
        } catch (error) {
            logger.error('Authentication error', error as Error);
            return formatJSONResponse(500, {
                status: 'error',
                message: 'Authentication error'
            });
        }
    };
};

/**
 * Role-based access control middleware
 * @param allowedRoles Array of roles that are allowed to access the route
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (
        handler: (event: AuthenticatedRequest, context: Context) => Promise<APIGatewayProxyResult>
    ) => {
        return async (event: AuthenticatedRequest, context: Context): Promise<APIGatewayProxyResult> => {
            try {
                logger.setContext("role middleware")
                // Check if user exists in the request (set by authMiddleware)
                if (!event.user) {
                    logger.warn('User not authenticated');
                    return formatJSONResponse(401, {
                        status: 'error',
                        message: 'Authentication required'
                    });
                }

                logger.info(JSON.stringify(event.user))

                // Check if user has one of the allowed roles
                if (!allowedRoles.includes(event.user.role)) {
                    logger.warn('Unauthorized access attempt', {
                        userRole: event.user.role,
                        allowedRoles
                    });
                    return formatJSONResponse(403, {
                        status: 'error',
                        message: 'You do not have permission to access this resource'
                    });
                }

                // Call the handler with the authenticated request
                return await handler(event, context);
            } catch (error) {
                logger.error('Role verification error', error as Error);
                return formatJSONResponse(500, {
                    status: 'error',
                    message: 'Role verification error'
                });
            }
        };
    };
};