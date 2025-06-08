const config = {
	API_BASE_URL: import.meta.env.VITE_APP_API_URL as string || 'https://gateway-microservice-run8-1-team2-gateway-service-dev.development.krci-dev.cloudmentor.academy/api',
	FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL as string,
	APP_NAME: import.meta.env.VITE_APP_NAME as string,
	APP_VERSION: import.meta.env.VITE_APP_VERSION as string,
	USE_MOCK_API: import.meta.env.VITE_APP_USE_MOCK_API === 'true',
} as const;

export default config;
