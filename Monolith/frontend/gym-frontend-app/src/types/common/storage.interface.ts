export interface CookieOptions {
	path?: string;
	domain?: string;
	expires?: Date | number; // Date object or days as number
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
	maxAge?: number; // in seconds
}

export type StorageValue = string | number | boolean | object | null;

export interface StorageInterface {
	set(key: string, value: StorageValue, options?: CookieOptions): void;
	get<T = StorageValue>(key: string): T | null;
	getAll(): Record<string, StorageValue>;
	remove(key: string): void;
	clear(): void;
	has(key: string): boolean;
}
