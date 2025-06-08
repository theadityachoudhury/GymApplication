const requiredEnvVars = ['VITE_APP_API_URL', 'VITE_APP_USE_MOCK_API'];

const missingEnvVars = requiredEnvVars.filter(
	envVar => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
	console.error(
		`Cannot start the app. Missing environment variables: \n${missingEnvVars.join('\n')}`
	);
	throw new Error(
		`Missing environment variables: ${missingEnvVars.join(', ')}`
	);
}

const config = {
	API_BASE_URL: import.meta.env.VITE_APP_API_URL as string,
	FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL as string,
	APP_NAME: import.meta.env.VITE_APP_NAME as string,
	APP_VERSION: import.meta.env.VITE_APP_VERSION as string,
	USE_MOCK_API: import.meta.env.VITE_APP_USE_MOCK_API === 'true',
} as const;

export default config;
