import { SelectOption } from '@/components/common/form/Select';
import { Role, UserPreferableActivity, UserTarget } from '../auth/user.enum';

export interface User {
	id: string;
	role: keyof typeof Role;
	email: string;
	lastName: string;
	firstName: string;
}

export interface UserDetails extends User {
	about?: string;
	fileUrls?: string[];
	image?: string;
	preferredActivity: UserPreferableActivity;
	role: Role;
	specialization?: SelectOption[];
	target: UserTarget;
}

export interface CoachUserData extends UserDetails {
	title?: string;
	about?: string;
	certificates?: string[];
}

export interface AdminUserData extends User {
	phoneNumber: string;
	role: Role.ADMIN;
}