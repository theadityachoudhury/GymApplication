export function decodeCognitoIdToken(idToken: string): Record<string, never> | null {
    const base64UrlDecode = (base64UrlString: string): string => {
        // Replace URL-safe characters with standard base64 characters
        let base64 = base64UrlString.replace(/-/g, '+').replace(/_/g, '/');

        // Pad with '=' to make length a multiple of 4
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }

        // Decode base64 string
        const binaryString = atob(base64);

        // Convert binary string to UTF-8 text
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    };

    try {
        const parts = idToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = parts[1];
        const decodedPayload = base64UrlDecode(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Failed to decode ID token:', (error as Error).message);
        throw error
    }
}