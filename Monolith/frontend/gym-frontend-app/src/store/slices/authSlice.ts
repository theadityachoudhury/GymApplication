import {
	AdminProfileEditType,
	CoachProfileUpdateType,
	LoginCredentials,
	PasswordChange,
	ProfileEditType,
	RegistrationCredentials,
} from '../../schemas/auth';
import { getAuthService } from '../../services/Auth/authServiceFactory';
import { AuthState } from '@/types/auth/auth.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '@/types/auth/user.enum';

const authService = getAuthService();

// Check if user is already authenticated based on session storage
const hasAccessToken = !!sessionStorage.getItem('accessToken');

const initialState: AuthState = {
	user: null,
	userDetail: null,
	token: sessionStorage.getItem('accessToken') || null,
	initialAuthCheckComplete: false,
	isAuthenticated: hasAccessToken,
	isLoading: false,
	error: null,
};

export const updateUserProfile = createAsyncThunk(
	'auth/updateProfile',
	async (
		profileData: Partial<ProfileEditType>,
		{ getState, rejectWithValue }
	) => {
		try {
			const token = (getState() as { auth: AuthState }).auth.token;

			if (!token) {
				return rejectWithValue('No token found');
			}

			// Only send fields that are provided (partial update)
			const updateData: Partial<ProfileEditType> = {};

			if (profileData.firstName !== undefined) {
				updateData.firstName = profileData.firstName;
			}

			if (profileData.lastName !== undefined) {
				updateData.lastName = profileData.lastName;
			}

			if (profileData.preferredActivity !== undefined) {
				updateData.preferredActivity = profileData.preferredActivity;
			}

			if (profileData.target !== undefined) {
				updateData.target = profileData.target;
			}

			const response = await authService.updateProfile(updateData);

			if (response.status >= 200 && response.status < 300) {
				return response.data;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message ||
				'Failed to update profile'
			);
		}
	}
);

export const updateCoachProfile = createAsyncThunk(
	'coach/updateProfile',
	async (
		profileData: Partial<CoachProfileUpdateType>,
		{ getState, rejectWithValue }
	) => {
		try {
			const token = (getState() as { auth: AuthState }).auth.token;

			if (!token) {
				return rejectWithValue('No token found');
			}

			// Only send fields that are provided (partial update)
			const updateData: Partial<CoachProfileUpdateType> = {};

			if (profileData.firstName !== undefined) {
				updateData.firstName = profileData.firstName;
			}

			if (profileData.lastName !== undefined) {
				updateData.lastName = profileData.lastName;
			}

			if (profileData.about !== undefined) {
				updateData.about = profileData.about;
			}

			if (profileData.title !== undefined) {
				updateData.title = profileData.title;
			}
			if (profileData.specialization !== undefined) {
				updateData.specialization = profileData.specialization;
			}

			const response = await authService.updateProfile(updateData);
			console.log(response);

			if (response.status >= 200 && response.status < 300) {
				return response.data;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message ||
				'Failed to update profile'
			);
		}
	}
);

export const updateAdminProfile = createAsyncThunk(
	'auth/updateProfile',
	async (
		profileData: Partial<AdminProfileEditType>,
		{ getState, rejectWithValue }
	) => {
		try {
			const token = (getState() as { auth: AuthState }).auth.token;

			if (!token) {
				return rejectWithValue('No token found');
			}

			// Only send fields that are provided (partial update)
			const updateData: Partial<AdminProfileEditType> = {};

			if (profileData.firstName !== undefined) {
				updateData.firstName = profileData.firstName;
			}

			if (profileData.lastName !== undefined) {
				updateData.lastName = profileData.lastName;
			}

			if (profileData.phoneNumber !== undefined) {
				updateData.phoneNumber = profileData.phoneNumber;
			}


			const response = await authService.updateProfile(updateData);

			if (response.status >= 200 && response.status < 300) {
				return response.data;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message ||
				'Failed to update profile'
			);
		}
	}
);

export const registerUser = createAsyncThunk(
	'auth/register',
	async (credential: RegistrationCredentials, { rejectWithValue }) => {
		try {
			const response = await authService.register(credential);

			if (response.status >= 200 && response.status < 300) {
				return response.data;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message || 'Registration failed'
			);
		}
	}
);

export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials: LoginCredentials, { rejectWithValue }) => {
		try {
			const response = await authService.login(credentials);

			if (response.status >= 200 && response.status < 300) {
				return response.data;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message || 'Login failed'
			);
		}
	}
);

export const changePassword = createAsyncThunk(
	'auth/changePassword',
	async (passwordData: PasswordChange, { getState, rejectWithValue }) => {
		try {
			const token = (getState() as { auth: AuthState }).auth.token;
			const role = (getState() as { auth: AuthState }).auth.userDetail?.role.toUpperCase()

			if (!token) {
				return rejectWithValue('No token found');
			}

			const response = await authService.changePassword(passwordData, role as Role);

			if (response.status >= 200 && response.status < 300) {
				return response.message;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message ||
				'Failed to change password'
			);
		}
	}
);

export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async (_, { rejectWithValue }) => {
		try {
			const response = await authService.logout();

			if (response.status >= 200 && response.status < 300) {
				return true;
			} else {
				return rejectWithValue(
					response.message || `Error: ${response.status}`
				);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message: string }).message || 'Logout failed'
			);
		}
	}
);

export const getUserProfile = createAsyncThunk(
	'auth/getUserProfile',
	async (_, { rejectWithValue }) => {
		try {
			const response = await authService.getCurrentUser();

			if (response.status >= 200 && response.status < 300) {
				return response;
			} else {
				return rejectWithValue(response.message);
			}
		} catch (error: unknown) {
			return rejectWithValue(
				(error as { message?: string }).message ||
				'Failed to fetch user profile'
			);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {

		logout: state => {
			// Clear tokens from session storage
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('tokenExpiry');

			// Update state
			state.token = null;
			state.user = null;
			state.isAuthenticated = false;
			state.error = null;
			state.userDetail = null;
		},
		clearError: state => {
			state.error = null;
		},
		setInitialAuthCheckComplete: state => {
			state.initialAuthCheckComplete = true;
		},
	},
	extraReducers: builder => {
		// Registration cases
		builder
			.addCase(registerUser.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, state => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(loginUser.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				loginUser.fulfilled,
				(
					state,
					action: PayloadAction<{ token: string }>
				) => {
					state.isLoading = false;
					state.isAuthenticated = true;
					state.token = action.payload.token;
				}
			)
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(updateUserProfile.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.userDetail = {
					...state.userDetail,
					...action.payload,
				};
			})
			.addCase(updateUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(updateCoachProfile.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateCoachProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.userDetail = {
					...state.userDetail,
					...action.payload,
				};
			})
			.addCase(updateCoachProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(changePassword.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(changePassword.fulfilled, state => {
				state.isLoading = false;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(logoutUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(logoutUser.fulfilled, state => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.userDetail = null;
				state.error = null;
			})
			.addCase(logoutUser.rejected, state => {
				// Even if server logout fails, we still clear the local state
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.userDetail = null;
				state.error = null;
			})

			.addCase(getUserProfile.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				// state.userDetail = { email: "adadsads" }
				state.userDetail = { ...action.payload.data, role: action.payload.data.role.toUpperCase() as Role };
				console.log(action.payload.data);

				state.error = null;
			})
			.addCase(getUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				state.userDetail = null;
				state.token = null
				state.isAuthenticated = false
			});
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
