import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/hooks/redux';
import { LoginCredentials, loginSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '@/store/slices/authSlice';
import Button from '../common/ui/CustomButton';
import { Link } from 'react-router';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import InputField from '../common/form/InputFeild';
import useToast from '@/hooks/useToast';

const LoginForm = () => {
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<LoginCredentials>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { showToast } = useToast();

	const onSubmit: SubmitHandler<LoginCredentials> = async data => {
		try {
			await dispatch(loginUser(data)).unwrap();
			showToast({
				type: 'success',
				title: 'Login Successful',
				description: 'You have successfully logged in.',
			});
			reset();
		} catch (error) {
			console.log(error);
			showToast({
				type: 'error',
				title: 'Login Failed',
				description: error as string === "Login failed: User does not exist." ? "Invalid email or password." : error as string,
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 mt-4 md:mt-8 space-y-3 w-full"
		>
			<InputField
				className="text-form-input"
				label="Email"
				type="email"
				placeholder="Enter your Email"
				error={errors.email?.message}
				{...register('email')}
			/>

			<div className="relative">
				<InputField
					className="text-form-input"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					placeholder="Enter your password"
					error={errors.password?.message}
					{...register('password')}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(prev => !prev)}
					className="absolute right-3 top-3 cursor-pointer text-gray-500"
				>
					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>

			<div>
				<Button
					type="submit"
					variant="primary"
					size="medium"
					fullWidth
					isLoading={isSubmitting}
				>
					Log In
				</Button>
				<p className="text-center mt-2 text-form-input">
					Dont't have an account?
					<Link
						className="uppercase font-bold cursor-pointer underline"
						to="/register"
					>
						{' '}
						Create new account{' '}
					</Link>
				</p>
			</div>
		</form>
	);
};

export default LoginForm;
