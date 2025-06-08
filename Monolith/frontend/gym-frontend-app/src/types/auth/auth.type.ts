import { CoachUserData, AdminUserData, User, UserDetails } from '../user/user.type';

export interface AuthState {
	user: User | null;
	userDetail: UserDetails | CoachUserData | AdminUserData | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	initialAuthCheckComplete: boolean;
}
