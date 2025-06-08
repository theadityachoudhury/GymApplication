import { Role } from '@/types/auth/user.enum';
import { User } from '@/types/user/user.type';

export function extractUserFromDecodedToken(
	decodedToken: Record<string, never>
): User | null {
	if (!decodedToken) {
		return null;
	}

	const { sub, email, family_name, given_name, ["custom:role"]: role } = decodedToken;

	if (!sub || !email || !family_name || !given_name) {
		console.error('Required fields are missing in token');
		return null;
	}

	return {
		id: sub,
		role: (role as string).toUpperCase() as Role,
		email,
		lastName: family_name,
		firstName: given_name,
	};
}
