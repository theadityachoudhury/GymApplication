// src/services/Coaches/coachesServiceFactory.ts
import { MockCoachesService } from './mockCoachesService';
import { ApiCoachesService } from './apiCoachesService';
import config from '@/config';

export const getCoachesService = () => {
	const useMockApi = config.USE_MOCK_API;
	console.log('Using mock API:', useMockApi);

	if (useMockApi) {
		return new MockCoachesService();
	} else {
		return new ApiCoachesService();
	}
};
