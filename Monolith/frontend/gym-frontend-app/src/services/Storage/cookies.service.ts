import {
	CookieOptions,
	StorageInterface,
	StorageValue,
} from '../../types/common/storage.interface';

export class CookieService implements StorageInterface {
	set(key: string, value: StorageValue, options: CookieOptions = {}): void {
		try {
			let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;

			if (options.path) cookieString += `; path=${options.path}`;
			if (options.domain) cookieString += `; domain=${options.domain}`;

			if (options.expires) {
				const expirationDate =
					typeof options.expires === 'number'
						? new Date(
								Date.now() +
									options.expires * 24 * 60 * 60 * 1000
							)
						: options.expires;
				cookieString += `; expires=${expirationDate.toUTCString()}`;
			}

			if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
			if (options.secure) cookieString += '; secure';
			if (options.sameSite)
				cookieString += `; samesite=${options.sameSite}`;

			document.cookie = cookieString;
		} catch (error) {
			console.error('Error setting cookie:', error);
		}
	}

	get<T = StorageValue>(key: string): T | null {
		try {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.startsWith(`${encodeURIComponent(key)}=`)) {
					const value = cookie.substring(
						encodeURIComponent(key).length + 1
					);
					return JSON.parse(decodeURIComponent(value)) as T;
				}
			}
			return null;
		} catch (error) {
			console.error('Error getting cookie:', error);
			return null;
		}
	}

	getAll(): Record<string, StorageValue> {
		const all: Record<string, StorageValue> = {};
		try {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				const separatorIndex = cookie.indexOf('=');
				if (separatorIndex > 0) {
					const key = decodeURIComponent(
						cookie.substring(0, separatorIndex)
					);
					const value = cookie.substring(separatorIndex + 1);
					all[key] = JSON.parse(decodeURIComponent(value));
				}
			}
		} catch (error) {
			console.error('Error getting all cookies:', error);
		}
		return all;
	}

	remove(key: string): void {
		try {
			// Set expiration to past date to remove the cookie
			document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
		} catch (error) {
			console.error('Error removing cookie:', error);
		}
	}

	clear(): void {
		try {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				const key = cookie.split('=')[0];
				this.remove(key);
			}
		} catch (error) {
			console.error('Error clearing cookies:', error);
		}
	}

	has(key: string): boolean {
		return this.get(key) !== null;
	}
}
