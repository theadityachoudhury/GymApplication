// src/types/authService.interface.ts

import {
	LoginCredentials,
	PasswordChange,
	ProfileEditType,
	RegistrationCredentials,
} from '@/schemas/auth';
import { UserDetails } from '../user/user.type';
import { Role } from './user.enum';

export interface AuthResponse<T> {
	data: T;
	status: number;
	message: string;
}

export interface IAuthService {
	login(
		loginData: LoginCredentials
	): Promise<AuthResponse<{ token: string; idToken: string }>>;
	register(userData: RegistrationCredentials): Promise<AuthResponse<null>>;
	getCurrentUser(): Promise<AuthResponse<UserDetails>>;
	updateProfile(
		profileData: Partial<ProfileEditType>
	): Promise<AuthResponse<UserDetails>>;
	changePassword(passwordData: PasswordChange, role: Role): Promise<AuthResponse<null>>;
	logout(): Promise<AuthResponse<null>>;
	refreshToken?(): Promise<AuthResponse<{ accessToken: string }>>;
	confirmRegistration?(
		email: string,
		code: string
	): Promise<AuthResponse<null>>;
	resendConfirmationCode?(email: string): Promise<AuthResponse<null>>;
	forgotPassword?(email: string): Promise<AuthResponse<null>>;
	resetPassword?(
		email: string,
		code: string,
		newPassword: string
	): Promise<AuthResponse<null>>;
	isAuthenticated?(): boolean;
	getAccessToken?(): string | null;
}
