import {
	StorageInterface,
	StorageValue,
} from '../../types/common/storage.interface';

export class LocalStorageService implements StorageInterface {
	set(key: string, value: StorageValue): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error('Error storing in localStorage:', error);
		}
	}

	get<T = StorageValue>(key: string): T | null {
		try {
			const item = localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : null;
		} catch (error) {
			console.error('Error retrieving from localStorage:', error);
			return null;
		}
	}

	getAll(): Record<string, StorageValue> {
		const all: Record<string, StorageValue> = {};
		try {
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					all[key] = this.get(key);
				}
			}
		} catch (error) {
			console.error(
				'Error retrieving all items from localStorage:',
				error
			);
		}
		return all;
	}

	remove(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error('Error removing from localStorage:', error);
		}
	}

	clear(): void {
		try {
			localStorage.clear();
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	}

	has(key: string): boolean {
		return this.get(key) !== null;
	}
}
