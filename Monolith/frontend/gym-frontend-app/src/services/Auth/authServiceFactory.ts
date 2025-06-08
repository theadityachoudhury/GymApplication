import { ApiAuthService } from './apiAuthService';

export const getAuthService = () => {
	// should be added when API is Ready
	// if (import.meta.env.REACT_APP_USE_MOCK_API === 'true')
	// return new MockAuthService();
	// else
	return new ApiAuthService();
};
