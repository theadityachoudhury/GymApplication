import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/hooks/redux';
import { RegistrationCredentials, registrationSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPreferableActivity, UserTarget } from '@/types/auth/user.enum';
import { registerUser } from '@/store/slices/authSlice';
import InputField from '../common/form/InputFeild';
import Button from '../common/ui/CustomButton';
import { Link, useNavigate } from 'react-router';
import useToast from '@/hooks/useToast';
import Select from '../common/form/Select';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
	const dispatch = useAppDispatch();
	const navigator = useNavigate();
	const userPreferableActivityOptions = Object.values(
		UserPreferableActivity
	).map(activity => ({
		label:
			activity.charAt(0).toUpperCase() + activity.slice(1).toLowerCase(),
		value: activity,
	}));
	const userTargetOptions = Object.values(UserTarget).map(target => ({
		label: target.charAt(0).toUpperCase() + target.slice(1).toLowerCase(),
		value: target,
	}));

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<RegistrationCredentials>({
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			preferableActivity: userPreferableActivityOptions[0].value,
			target: userTargetOptions[0].value,
		},
	});

	const { showToast } = useToast();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);


	const onSubmit = async (data: RegistrationCredentials) => {
		try {
			await dispatch(registerUser(data)).unwrap();
			if (data) {
				showToast({
					type: 'success',
					title: 'Registration Successful',
					description: 'You have successfully Registered.',
				});
				navigator('/login');
			} else {
				throw new Error('failed to register');
			}
			reset();
		} catch (error) {
			console.error('Registration failed:', error);
			showToast({
				type: 'error',
				title: 'Registration Failed',
				description: error as string,
			});
		}
	};

	return (
		<form
			className="flex flex-col gap-4 space-y-1 w-full"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0">
				<Controller
					name="firstName"
					control={control}
					render={({ field }) => (
						<InputField
							className="text-form-input"
							label="First Name"
							placeholder="Enter your first name"
							type="text"
							helperText="e.g. Johnson"
							error={errors.firstName?.message}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							ref={field.ref}
						/>
					)}
				/>
				<Controller
					name="lastName"
					control={control}
					render={({ field }) => (
						<InputField
							className="text-form-input"
							label="Last Name"
							placeholder="Enter your last name"
							type="text"
							helperText="e.g. Doe"
							error={errors.lastName?.message}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							ref={field.ref}
						/>
					)}
				/>
			</div>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<InputField
						className="text-form-input"
						label="Email"
						placeholder="Enter your email"
						type="email"
						helperText="e.g. username@domain.com"
						error={errors.email?.message}
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						ref={field.ref}
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<div className="relative">
						<InputField
							className="text-form-input"
							label="Password"
							placeholder="Enter your password"
							type={showPassword ? 'text' : 'password'}
							helperText="At least one capital letter required"
							error={errors.password?.message}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							ref={field.ref}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(prev => !prev)}
							className="absolute right-3 top-3 cursor-pointer text-gray-500"
						>
							{showPassword ? (
								<EyeOff size={20} />
							) : (
								<Eye size={20} />
							)}
						</button>
					</div>
				)}
			/>

			<Controller
				name="confirmPassword"
				control={control}
				render={({ field }) => (
					<div className="relative">
						<InputField
							className="text-form-input"
							label="Confirm Password"
							placeholder="Re-enter your password"
							type={showConfirmPassword ? 'text' : 'password'}
							helperText="Must match the password"
							error={errors.confirmPassword?.message}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							ref={field.ref}
						/>
						<button
							type="button"
							onClick={() =>
								setShowConfirmPassword(prev => !prev)
							}
							className="absolute right-3 top-3 cursor-pointer text-gray-500"
						>
							{showConfirmPassword ? (
								<EyeOff size={20} />
							) : (
								<Eye size={20} />
							)}
						</button>
					</div>
				)}
			/>

			<Controller
				name="preferableActivity"
				control={control}
				render={({ field }) => (
					<Select
						className="text-form-output"
						label="Preferable Activity"
						options={userPreferableActivityOptions}
						onChange={field.onChange}
						value={field.value}
						name={field.name}
					/>
				)}
			/>

			<Controller
				name="target"
				control={control}
				render={({ field }) => (
					<Select
						className="text-form-output"
						label="Target"
						options={userTargetOptions}
						onChange={field.onChange}
						value={field.value}
						name={field.name}
					/>
				)}
			/>

			<div>
				<Button
					className="text-button-primary"
					type="submit"
					variant="primary"
					size="medium"
					fullWidth
					isLoading={isSubmitting}
				>
					Create Account
				</Button>
				<p className="text-center mt-2 text-form-input">
					Already have an account?{' '}
					<Link
						className="uppercase font-bold cursor-pointer underline"
						to="/login"
					>
						Login Here
					</Link>
				</p>
			</div>
		</form>
	);
};

export default RegisterForm;