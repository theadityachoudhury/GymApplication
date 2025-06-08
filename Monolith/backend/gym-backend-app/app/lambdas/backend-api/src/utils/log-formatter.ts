export const formatForLogging = (
    obj: Record<string, any>,
    sensitiveKeys: string[] = ['password', 'token', 'secret', 'refreshToken', 'accessToken', 'idToken', 'authorization']
): Record<string, any> => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        // Check if this is a sensitive key
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
            result[key] = '[REDACTED]';
        }
        // Handle nested objects
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = formatForLogging(value, sensitiveKeys);
        }
        // Handle arrays
        else if (Array.isArray(value)) {
            result[key] = value.map(item =>
                typeof item === 'object' ? formatForLogging(item, sensitiveKeys) : item
            );
        }
        // Handle primitive values
        else {
            result[key] = value;
        }
    }

    return result;
};