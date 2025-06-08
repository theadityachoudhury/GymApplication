import { IS_PRODUCTION } from "@/config/constant";

// Log levels
export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    HTTP = 'HTTP'
}

// Interface for log entry
interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    requestId?: string;
    [key: string]: any; // Additional metadata
}

export class Logger {
    private static instance: Logger;
    private context: string = '';
    private minLevel: LogLevel;

    private constructor() {
        // Set minimum log level based on environment
        this.minLevel = IS_PRODUCTION ? LogLevel.INFO : LogLevel.DEBUG;
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public setContext(context: string): void {
        this.context = context;
    }

    public setMinLevel(level: LogLevel): void {
        this.minLevel = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel);
        return levels.indexOf(level) <= levels.indexOf(this.minLevel);
    }

    private log(level: LogLevel, message: string, meta: Record<string, any> = {}): void {
        if (!this.shouldLog(level)) {
            return;
        }

        const logEntry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...meta
        };

        if (this.context) {
            logEntry.context = this.context;
        }

        // For CloudWatch, we want to output a single line of JSON
        const logString = JSON.stringify(logEntry);

        // Output to console based on level
        switch (level) {
            case LogLevel.ERROR:
                console.error(logString);
                break;
            case LogLevel.WARN:
                console.warn(logString);
                break;
            case LogLevel.INFO:
            case LogLevel.HTTP:
                console.info(logString);
                break;
            case LogLevel.DEBUG:
                console.debug(logString);
                break;
            default:
                console.log(logString);
        }
    }

    public debug(message: string, meta: Record<string, any> = {}): void {
        this.log(LogLevel.DEBUG, message, meta);
    }

    public info(message: string, meta: Record<string, any> = {}): void {
        this.log(LogLevel.INFO, message, meta);
    }

    public warn(message: string, meta: Record<string, any> = {}): void {
        this.log(LogLevel.WARN, message, meta);
    }

    public error(message: string, error?: Error | string, meta: Record<string, any> = {}): void {
        const errorMeta = { ...meta };

        if (error) {
            if (error instanceof Error) {
                errorMeta.errorName = error.name;
                errorMeta.stackTrace = error.stack;
                errorMeta.errorMessage = error.message;
            } else {
                errorMeta.errorMessage = error;
            }
        }

        this.log(LogLevel.ERROR, message, errorMeta);
    }

    public http(message: string, meta: Record<string, any> = {}): void {
        this.log(LogLevel.HTTP, message, meta);
    }

    // Log API Gateway request
    public logApiGatewayRequest(event: any, context: any): void {
        const requestId = event.requestContext?.requestId || context.awsRequestId;

        const meta = {
            requestId,
            path: event.path,
            httpMethod: event.httpMethod,
            sourceIp: event.requestContext?.identity?.sourceIp,
            userAgent: event.headers?.['User-Agent'] || event.headers?.['user-agent'],
            queryParams: event.queryStringParameters || {},
            pathParams: event.pathParameters || {},
            stage: event.requestContext?.stage,
            apiId: event.requestContext?.apiId,
            // Don't log body for security reasons
            hasBody: !!event.body
        };

        this.http(`API Request: ${event.httpMethod} ${event.path}`, meta);
    }

    // Log API Gateway response
    public logApiGatewayResponse(response: any, executionTime: number, requestId?: string): void {
        const meta = {
            requestId,
            statusCode: response.statusCode,
            executionTimeMs: executionTime,
            hasHeaders: !!response.headers,
            bodySize: response.body ? response.body.length : 0
        };

        this.http(`API Response: ${response.statusCode}`, meta);
    }

    // Log error with request context
    public logApiGatewayError(error: Error, event: any, context: any): void {
        const requestId = event.requestContext?.requestId || context.awsRequestId;

        const meta = {
            requestId,
            path: event.path,
            httpMethod: event.httpMethod,
            errorName: error.name,
            stackTrace: error.stack
        };

        this.error(`API Error: ${error.message}`, error, meta);
    }
}

// Export a default logger instance
export const logger = Logger.getInstance();