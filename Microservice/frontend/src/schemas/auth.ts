import { z } from 'zod';
import { UserPreferableActivity, UserTarget } from '../types/auth/user.enum';

const nameValidation = z
	.string()
	.min(1, 'This field is required')
	.max(50, 'This field is too long')
	.regex(
		/^[a-zA-Z\s'-]+$/,
		'Only letters, spaces, apostrophes, and hyphens are allowed'
	);

// Common password validation
const passwordValidation = z
	.string()
	.min(1, 'Password is required')
	.min(8, 'Password must be at least 8 characters')
	.regex(/^\S*$/, 'Password cannot contain spaces')
	.max(16, 'Password should be less than 16 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.regex(
		/[^A-Za-z0-9]/,
		'Password must contain at least one special character'
	);

// Login schema
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
	password: passwordValidation,
});

export const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, 'Old password is required'),
		newPassword: passwordValidation,
		confirmPassword: z.string().min(1, 'Please confirm your new password'),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const profileEditSchema = z.object({
	firstName: nameValidation,
	lastName: nameValidation,
	preferredActivity: z.nativeEnum(UserPreferableActivity, {
		errorMap: () => ({ message: 'Please select a valid activity' }),
	}),
	target: z.nativeEnum(UserTarget, {
		errorMap: () => ({ message: 'Please select a valid target' }),
	}),
});

export const coachProfileEditSchema = z.object({
	firstName: nameValidation,
	lastName: nameValidation,
	title: z.string().optional(),
	about: z.string().optional(),
	certificates: z.array(z.string()).optional(),
	specialization: z.array(z.object({
		value: z.string(),
		label: z.string(),
	})).optional(),
});

export const coachProfileUpdateSchema = z.object({
	firstName: nameValidation,
	lastName: nameValidation,
	title: z.string().optional(),
	about: z.string().optional(),
	certificates: z.array(z.string()).optional(),
	specialization: z.array(z.string()).optional(),
});

// Registration schema
export const registrationSchema = z
	.object({
		firstName: nameValidation,
		lastName: nameValidation,
		email: z.string().email('Invalid email address'),
		password: passwordValidation,
		confirmPassword: passwordValidation,
		preferableActivity: z.string().nonempty('Please select an activity'),
		target: z.string().nonempty('Please select a target'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'], // Set the error on the confirmPassword field
	});


export const adminProfileEditSchema = z.object({
  firstName: nameValidation,
  lastName: nameValidation,
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number format. Only numbers, spaces, and dashes are allowed')
    .refine(value => {
      // Remove non-numeric characters and check if there are at least 10 digits
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10;
    }, 'Phone number must contain at least 10 digits'),
});


export type AdminProfileEditType = z.infer<typeof adminProfileEditSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegistrationCredentials = z.infer<typeof registrationSchema>;
export type ProfileEditType = z.infer<typeof profileEditSchema>;
export type CoachProfileEditType = z.infer<typeof coachProfileEditSchema>;
export type CoachProfileUpdateType = z.infer<typeof coachProfileUpdateSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;
