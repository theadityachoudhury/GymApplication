import { StorageInterface } from '../../types/common/storage.interface';
import { CookieService } from './cookies.service';
import { LocalStorageService } from './local-storage.service';

export class StorageFactory {
	static localStorage: StorageInterface;
	static cookieStorage: StorageInterface;
	static getStorage(type: 'local' | 'cookie'): StorageInterface {
		switch (type) {
			case 'local':
				return new LocalStorageService();
			case 'cookie':
				return new CookieService();
			default:
				return new LocalStorageService();
		}
	}
}
