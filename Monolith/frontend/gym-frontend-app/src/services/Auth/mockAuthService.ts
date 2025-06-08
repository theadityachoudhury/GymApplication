/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Role, UserPreferableActivity } from '@/types/auth/user.enum';
import { delay } from '../../helpers/utils/delay';
import {
	LoginCredentials,
	PasswordChange,
	ProfileEditType,
	RegistrationCredentials,
} from '../../schemas/auth';
import {
	AuthResponse,
	IAuthService,
} from '../../types/auth/authService.interface';
import { User, UserDetails } from '../../types/user/user.type';

// Import initial JSON data
import usersJson from '../../MockData/users.json';
import userDetailsJson from '../../MockData/userDetails.json';
import credentialsJson from '../../MockData/credentials.json';
import coachesJson from '../../MockData/coaches.json';

// Storage keys
const STORAGE_KEYS = {
	USERS: 'mock_auth_users',
	USER_DETAILS: 'mock_auth_user_details',
	CREDENTIALS: 'mock_auth_credentials',
	COACHES: 'mock_auth_coaches',
};

// Helper function to get data from localStorage or use default
function getStoredData<T>(key: string, defaultData: T): T {
	try {
		const storedData = localStorage.getItem(key);
		return storedData ? JSON.parse(storedData) : defaultData;
	} catch (error) {
		console.error(`Error retrieving ${key} from localStorage:`, error);
		return defaultData;
	}
}

// Helper function to save data to localStorage
function saveData<T>(key: string, data: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error(`Error saving ${key} to localStorage:`, error);
	}
}

// Initialize data from localStorage or default JSON
let users: User[] = getStoredData<User[]>(
	STORAGE_KEYS.USERS,
	usersJson as User[]
);
let userDetails: UserDetails[] = getStoredData<UserDetails[]>(
	STORAGE_KEYS.USER_DETAILS,
	userDetailsJson as UserDetails[]
);
let credentials: Record<string, string> = getStoredData<Record<string, string>>(
	STORAGE_KEYS.CREDENTIALS,
	credentialsJson as Record<string, string>
);
let coaches: string[] = getStoredData<string[]>(
	STORAGE_KEYS.COACHES,
	coachesJson as string[]
);

export class MockAuthService implements IAuthService {
	async login(
		loginData: LoginCredentials
	): Promise<AuthResponse<{ token: string }>> {
		await delay(800);

		const { email, password } = loginData;

		if (!credentials[email]) {
			return {
				data: { token: '' },
				status: 404,
				message: 'User not found',
			};
		}

		if (credentials[email] !== password) {
			return {
				data: { token: '' },
				status: 401,
				message: 'Invalid password',
			};
		}

		const user = users.find(u => u.email === email);

		if (!user) {
			return {
				data: { token: '' },
				status: 404,
				message: 'User not found',
			};
		}

		const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}-data-${JSON.stringify(user)}`;

		return { data: { token }, status: 200, message: 'Login successful' };
	}

	async register(
		userData: RegistrationCredentials
	): Promise<AuthResponse<null>> {
		await delay(1000);

		const { email, password } = userData;

		if (credentials[email]) {
			return {
				data: null,
				status: 409,
				message: 'Email already in use',
			};
		}

		const isCoach = coaches.some(coach => userData.email === coach);

		const newUser: User = {
			id: (users.length + 1).toString(),
			email,
			role: isCoach ? 'COACH' : 'CLIENT',
		};

		// Update users array and save to localStorage
		const updatedUsers = [...users, newUser];
		users = updatedUsers;
		saveData(STORAGE_KEYS.USERS, updatedUsers);

		// Update credentials and save to localStorage
		const updatedCredentials = { ...credentials, [email]: password };
		credentials = updatedCredentials;
		saveData(STORAGE_KEYS.CREDENTIALS, updatedCredentials);

		const newUserDetails: UserDetails = {
			...userData,
			preferableActivity:
				userData.preferableActivity as UserPreferableActivity,
			id: newUser.id,
			role: isCoach ? Role.COACH : Role.CLIENT,
		};

		// Update userDetails and save to localStorage
		const updatedUserDetails = [...userDetails, newUserDetails];
		userDetails = updatedUserDetails;
		saveData(STORAGE_KEYS.USER_DETAILS, updatedUserDetails);

		return {
			data: null,
			status: 201,
			message: 'Registration successful',
		};
	}

	async getCurrentUser(token: string): Promise<AuthResponse<UserDetails>> {
		await delay(500);

		if (!token || !token.startsWith('mock-jwt-token-')) {
			return {
				data: {} as UserDetails,
				status: 401,
				message: 'Invalid token',
			};
		}

		try {
			const user: User = JSON.parse(token.split('-data-')[1]);
			const findUser = userDetails.find(u => u.id === user.id);

			if (!user || !findUser) {
				return {
					data: {} as UserDetails,
					status: 404,
					message: 'User not found',
				};
			}

			return {
				data: findUser,
				status: 200,
				message: 'User retrieved successfully',
			};
		} catch (error) {
			console.log(error);

			return {
				data: {} as UserDetails,
				status: 401,
				message: 'Invalid token format',
			};
		}
	}

	// Add a utility method to reset the data to defaults (useful for testing)
	resetToDefaults(): void {
		users = usersJson as User[];
		userDetails = userDetailsJson as UserDetails[];
		credentials = credentialsJson as Record<string, string>;
		coaches = coachesJson as string[];

		saveData(STORAGE_KEYS.USERS, users);
		saveData(STORAGE_KEYS.USER_DETAILS, userDetails);
		saveData(STORAGE_KEYS.CREDENTIALS, credentials);
		saveData(STORAGE_KEYS.COACHES, coaches);
	}

	async updateProfile(
		token: string,
		profileData: Partial<ProfileEditType>
	): Promise<AuthResponse<UserDetails>> {
		await delay(800);

		if (!token || !token.startsWith('mock-jwt-token-')) {
			return {
				data: {} as UserDetails,
				status: 401,
				message: 'Invalid token',
			};
		}

		try {
			const user: User = JSON.parse(token.split('-data-')[1]);
			const userIndex = userDetails.findIndex(u => u.id === user.id);

			if (userIndex === -1) {
				return {
					data: {} as UserDetails,
					status: 404,
					message: 'User not found',
				};
			}

			console.log('userDetails', userDetails);
			console.log('userIndex', userIndex);

			// Update only the fields that are provided
			const updatedUserDetails = {
				...userDetails[userIndex],
				...profileData,
			};

			// Update the user details array
			const newUserDetails = [...userDetails];
			newUserDetails[userIndex] = updatedUserDetails;

			// Save to localStorage
			userDetails = newUserDetails;
			saveData(STORAGE_KEYS.USER_DETAILS, newUserDetails);

			return {
				data: updatedUserDetails,
				status: 200,
				message: 'Profile updated successfully',
			};
		} catch (error) {
			console.log(error);

			return {
				data: {} as UserDetails,
				status: 401,
				message: 'Invalid token format',
			};
		}
	}

	async changePassword(
		token: string,
		passwordData: PasswordChange
	): Promise<AuthResponse<null>> {
		await delay(800);

		if (!token || !token.startsWith('mock-jwt-token-')) {
			return {
				data: null,
				status: 401,
				message: 'Invalid token',
			};
		}

		try {
			const user: User = JSON.parse(token.split('-data-')[1]);
			const email = user.email;

			// Check if old password is correct
			if (credentials[email] !== passwordData.oldPassword) {
				return {
					data: null,
					status: 401,
					message: 'Current password is incorrect',
				};
			}

			// Update password
			credentials[email] = passwordData.newPassword;

			// Save to localStorage
			saveData(STORAGE_KEYS.CREDENTIALS, credentials);

			return {
				data: null,
				status: 200,
				message: 'Password changed successfully',
			};
		} catch (error) {
			console.log(error);

			return {
				data: null,
				status: 401,
				message: 'Invalid token format',
			};
		}
	}
}
