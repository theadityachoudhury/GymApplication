// src/services/Auth/apiAuthService.ts

import { AuthResponse } from '@/types/auth/authService.interface';
import {
	AdminProfileEditType,
	CoachProfileEditType,
	LoginCredentials,
	PasswordChange,
	ProfileEditType,
	RegistrationCredentials,
} from '../../schemas/auth';
import { AxiosError } from 'axios';
import { AdminUserData, CoachUserData, UserDetails } from '@/types/user/user.type';
import { Role } from '@/types/auth/user.enum';
import { apiClient, LoginResponse, RefreshTokenResponse } from '@/services/Api/axiosInstance';

export class ApiAuthService {
	/**
	 * Login user with email and password
	 */
	async login(
		loginData: LoginCredentials
	): Promise<AuthResponse<{ token: string }>> {
		try {
			// Use withCredentials specifically for login with proper type
			const response =
				await apiClient.requestWithCredentials<LoginResponse>(
					'post',
					'/auth/sign-in',
					loginData
				);

			console.log(response.data);

			// Extract tokens from the response with proper typing
			const { accessToken } = response.data.data;

			// Store access token in session storage
			sessionStorage.setItem('accessToken', accessToken);
			const expiresIn = Date.now();
			// Store token expiry time
			if (expiresIn) {
				const expiryTime = Date.now() + expiresIn * 1000;
				sessionStorage.setItem('tokenExpiry', expiryTime.toString());
			}

			return {
				data: { token: accessToken },
				status: response.status,
				message: response.data.message || 'Login successful',
			};
		} catch (error: unknown) {
			console.error('Login error:', error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message = error.response?.data?.message || 'Login failed';
				return { data: { token: '' }, status, message };
			}
			return {
				data: { token: '' },
				status: 500,
				message: 'Login failed due to unexpected error',
			};
		}
	}

	async register(
		userData: RegistrationCredentials
	): Promise<AuthResponse<null>> {
		try {
			const response = await apiClient.axios.post(
				'/auth/sign-up',
				userData
			);

			return {
				data: null,
				status: response.status,
				message: response.data.message || 'Registration successful',
			};
		} catch (error: unknown) {
			console.error('Registration error:', error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message || 'Registration failed';
				return { data: null, status, message };
			}
			return {
				data: null,
				status: 500,
				message: 'Registration failed due to unexpected error',
			};
		}
	}

	async getCurrentUser(): Promise<AuthResponse<UserDetails | CoachUserData>> {
		try {
			const response = await apiClient.axios.get('/manage/profile');
			console.log(response);

			return {
				data: response.data.data,
				status: response.status,
				message: response.data.message || 'User retrieved successfully',
			};
		} catch (error: unknown) {
			console.error('GetCurrentUser error:', error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message ||
					'Failed to get user details';
				return { data: {} as UserDetails, status, message };
			}
			return {
				data: {} as UserDetails,
				status: 500,
				message: 'Unexpected error getting user details',
			};
		}
	}

	async updateProfile(profileData: Partial<ProfileEditType | CoachProfileEditType | AdminProfileEditType>): Promise<AuthResponse<UserDetails | CoachUserData | AdminUserData>> {
		try {
			console.log(profileData);
			const response = await apiClient.axios.put('/manage/profile', profileData);
			console.log(response);

			return {
				data: response.data.data,
				status: response.status,
				message:
					response.data.message || 'Profile updated successfully',
			};
		} catch (error: unknown) {
			console.error('UpdateProfile error:', error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message || 'Failed to update profile';
				return { data: {} as UserDetails, status, message };
			}
			return {
				data: {} as UserDetails,
				status: 500,
				message: 'Unexpected error updating profile',
			};
		}
	}

	async changePassword(
		passwordData: PasswordChange,
		role: Role
	): Promise<AuthResponse<null>> {
		try {
			// const rolePath = role.toString().toLowerCase();
			const response = await apiClient.axios.put(
				`/manage/password`,
				passwordData
			);

			return {
				data: null,
				status: response.status,
				message:
					response.data.message || 'Password changed successfully',
			};
		} catch (error: unknown) {
			console.error('ChangePassword error:', role, error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message ||
					'Failed to change password';
				return { data: null, status, message };
			}
			return {
				data: null,
				status: 500,
				message: 'Unexpected error changing password',
			};
		}
	}

	async refreshToken(): Promise<AuthResponse<{ accessToken: string }>> {
		try {
			const response =
				await apiClient.requestWithCredentials<RefreshTokenResponse>(
					'post',
					'/auth/refresh-token',
					{}
				);
			const { idToken, accessToken } = response.data.tokens;
			sessionStorage.setItem('accessToken', accessToken);
			sessionStorage.setItem('idToken', idToken);
			return {
				data: { accessToken },
				status: response.status,
				message:
					response.data.message || 'Token refreshed successfully',
			};
		} catch (error: unknown) {
			console.error('RefreshToken error:', error);
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message || 'Failed to refresh token';
				return { data: { accessToken: '' }, status, message };
			}
			return {
				data: { accessToken: '' },
				status: 500,
				message: 'Unexpected error refreshing token',
			};
		}
	}

	async logout(): Promise<AuthResponse<null>> {
		try {
			await apiClient.requestWithCredentials('post', '/auth/logout', {});
			this.clearAuthData();

			return { data: null, status: 200, message: 'Logout successful' };
		} catch (error: unknown) {
			console.error('Logout error:', error);
			this.clearAuthData();
			if (error instanceof AxiosError) {
				const status = error.response?.status || 500;
				const message =
					error.response?.data?.message ||
					'Logout failed on server but completed locally';
				return { data: null, status, message };
			}
			return {
				data: null,
				status: 500,
				message: 'Unexpected error during logout',
			};
		}
	}

	private clearAuthData(): void {
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('idToken');
		sessionStorage.removeItem('tokenExpiry');
		// The refresh token cookie will be cleared by the server
	}

	isAuthenticated(): boolean {
		const accessToken = sessionStorage.getItem('accessToken');
		const tokenExpiry = sessionStorage.getItem('tokenExpiry');

		if (!accessToken) {
			return false;
		}

		// If we have an expiry time, check if the token is expired
		if (tokenExpiry) {
			return parseInt(tokenExpiry) > Date.now();
		}

		// If we have a token but no expiry time, assume authenticated
		return true;
	}

	getAccessToken(): string | null {
		return sessionStorage.getItem('accessToken');
	}
}