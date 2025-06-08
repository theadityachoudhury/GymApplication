interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
    path?: string;
}

export const setCookie = (
    name: string,
    value: string,
    options: CookieOptions = {}
): string => {
    const cookieOptions: string[] = [];

    if (options.httpOnly) cookieOptions.push('HttpOnly');
    if (options.secure) cookieOptions.push('Secure');
    if (options.sameSite) cookieOptions.push(`SameSite=${options.sameSite}`);
    if (options.maxAge) cookieOptions.push(`Max-Age=${options.maxAge}`);
    if (options.domain) cookieOptions.push(`Domain=${options.domain}`);
    if (options.path) cookieOptions.push(`Path=${options.path}`);

    return `${name}=${value}; ${cookieOptions.join('; ')}`;
};

export const parseCookies = (cookieHeader?: string): Record<string, string> => {
    if (!cookieHeader) return {};

    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value || '';
        return cookies;
    }, {} as Record<string, string>);
};