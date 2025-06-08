// src/services/api/apiClient.ts

import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

// Define a type for refresh token subscribers
// type RefreshTokenSubscriber = (token: string) => void;

// Define response types for better type safety
export interface LoginResponse {
	status: string;
	message: string;
	data: {
		accessToken: string;
		role: string
	};
}

export interface RefreshTokenResponse {
	status: string;
	message: string;
	tokens: {
		idToken: string;
		accessToken: string;
		expiresIn?: number;
	};
}

export interface ApiErrorResponse {
	status: string;
	message: string;
}

class ApiClient {
	private instance: AxiosInstance;
	// private isRefreshing = false;
	// private refreshSubscribers: RefreshTokenSubscriber[] = [];
	private API_URL =
		import.meta.env.VITE_APP_API_URL ||
		'https://2qw2t77xw5.execute-api.eu-west-2.amazonaws.com/dev';

	constructor() {
		this.instance = axios.create({
			baseURL: this.API_URL,
			timeout: 15000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	/**
	 * Set up request and response interceptors
	 */
	private setupInterceptors(): void {
		// Request interceptor for adding auth token
		this.instance.interceptors.request.use(
			this.handleRequest.bind(this),
			this.handleRequestError.bind(this)
		);

		// // Response interceptor for handling errors and token refresh
		// this.instance.interceptors.response.use(
		// 	this.handleResponse.bind(this),
		// 	this.handleResponseError.bind(this)
		// );
	}

	/**
	 * Handle outgoing requests
	 */
	private handleRequest(
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig {
		const accessToken = sessionStorage.getItem('accessToken');

		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	}

	/**
	 * Handle request errors
	 */
	private handleRequestError(error: AxiosError): Promise<never> {
		return Promise.reject(error);
	}

	/**
	 * Handle successful responses
	 */
	// private handleResponse(response: AxiosResponse): AxiosResponse {
	// 	return response;
	// }

	/**
	 * Handle response errors, including token refresh
	 */
	// private async handleResponseError(error: AxiosError): Promise<unknown> {
	// 	const originalRequest = error.config as AxiosRequestConfig & {
	// 		_retry?: boolean;
	// 	};

	// 	// Check if error is 401 (Unauthorized) and has the specific message
	// 	const isExpiredTokenError =
	// 		error.response?.status === 401 &&
	// 		error.response?.data &&
	// 		typeof error.response.data === 'object' &&
	// 		'message' in error.response.data &&
	// 		error.response.data.message === 'Invalid or expired token';

	// 	// Only proceed with token refresh for the specific error message
	// 	if (isExpiredTokenError && !originalRequest._retry) {
	// 		if (this.isRefreshing) {
	// 			// If already refreshing, wait for new token
	// 			try {
	// 				const newToken = await new Promise<string>(resolve => {
	// 					this.refreshSubscribers.push((token: string) => {
	// 						resolve(token);
	// 					});
	// 				});

	// 				// Update the original request with new token
	// 				if (originalRequest.headers) {
	// 					originalRequest.headers.Authorization = `Bearer ${newToken}`;
	// 				}

	// 				// Retry the original request
	// 				return this.instance(originalRequest);
	// 			} catch (refreshError) {
	// 				return Promise.reject(refreshError);
	// 			}
	// 		}

	// 		// Set refreshing flag
	// 		originalRequest._retry = true;
	// 		this.isRefreshing = true;

	// 		try {
	// 			// Call refresh token endpoint
	// 			const response = await this.refreshTokenRequest();

	// 			if (response.accessToken) {
	// 				const newToken = response.accessToken;

	// 				// Update authorization header
	// 				if (originalRequest.headers) {
	// 					originalRequest.headers.Authorization = `Bearer ${newToken}`;
	// 				}

	// 				// Process queued requests
	// 				this.onTokenRefreshed(newToken);

	// 				// Reset refreshing flag
	// 				this.isRefreshing = false;

	// 				// Retry the original request
	// 				return this.instance(originalRequest);
	// 			} else {
	// 				// If refresh fails, trigger logout
	// 				this.handleLogout();
	// 				return Promise.reject(
	// 					new Error('Session expired. Please login again.')
	// 				);
	// 			}
	// 		} catch (refreshError) {
	// 			// If refresh fails, trigger logout
	// 			this.handleLogout();
	// 			this.isRefreshing = false;
	// 			return Promise.reject(refreshError);
	// 		}
	// 	}

	// 	// For other errors, just reject the promise
	// 	return Promise.reject(error);
	// }

	/**
	 * Process queued requests with new token
	 */
	// private onTokenRefreshed(token: string): void {
	// 	this.refreshSubscribers.forEach(callback => callback(token));
	// 	this.refreshSubscribers = [];
	// }

	/**
	 * Handle logout - clear tokens and dispatch event
	 */
	// private handleLogout(): void {
	// 	sessionStorage.removeItem('accessToken');
	// 	sessionStorage.removeItem('idToken');
	// 	sessionStorage.removeItem('tokenExpiry');

	// 	// Dispatch logout event
	// 	window.dispatchEvent(new CustomEvent('auth:logout'));
	// }

	/**
	 * Make a request to refresh the token
	 */
	// private async refreshTokenRequest(): Promise<{
	// 	accessToken: string;
	// 	idToken: string;
	// }> {
	// 	try {
	// 		const response = await axios.post<RefreshTokenResponse>(
	// 			`${this.API_URL}/auth/refresh-token`,
	// 			{},
	// 			{ withCredentials: true }
	// 		);

	// 		const { idToken, accessToken } = response.data.tokens;

	// 		// Store the new tokens
	// 		sessionStorage.setItem('accessToken', accessToken);
	// 		sessionStorage.setItem('idToken', idToken);

	// 		return { accessToken, idToken };
	// 	} catch (error) {
	// 		console.error('Token refresh failed:', error);
	// 		throw error;
	// 	}
	// }

	/**
	 * Get the axios instance
	 */
	public get axios(): AxiosInstance {
		return this.instance;
	}

	/**
	 * Make a request with credentials (for auth endpoints)
	 */
	public async requestWithCredentials<T>(
		method: 'get' | 'post' | 'put' | 'delete',
		url: string,
		data?: unknown
	): Promise<AxiosResponse<T>> {
		const config: AxiosRequestConfig = {
		};

		switch (method) {
			case 'get':
				return this.instance.get<T>(url, config);
			case 'post':
				return this.instance.post<T>(url, data, config);
			case 'put':
				return this.instance.put<T>(url, data, config);
			case 'delete':
				return this.instance.delete<T>(url, config);
			default:
				throw new Error(`Unsupported method: ${method}`);
		}
	}
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the axios instance for direct use
export const axiosInstance = apiClient.axios;