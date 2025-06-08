import useToast from '@/hooks/useToast';
import { PasswordChange, passwordChangeSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../common/form/InputFeild';
import Button from '../common/ui/CustomButton';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { changePassword } from '@/store/slices/authSlice';

function ChangePassword() {
	const dispatch = useAppDispatch();

	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PasswordChange>({
		resolver: zodResolver(passwordChangeSchema),
		defaultValues: {
			confirmPassword: '',
			newPassword: '',
			currentPassword: '',
		},
	});

	const { showToast } = useToast();

	const onSubmit: SubmitHandler<PasswordChange> = async data => {
		try {
			await dispatch(changePassword(data)).unwrap();

			showToast({
				type: 'success',
				title: 'Password Changed',
				description: 'Your password has been successfully updated.',
			});
			reset();
		} catch (error) {
			console.log(error);
			showToast({
				type: 'error',
				title: 'Password Change Failed',
				description: error as string,
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 mt-4 md:mt-8 space-y-3 w-full"
		>
			<div className="relative">
				<InputField
					label="Old Password"
					type={showOldPassword ? 'text' : 'password'}
					placeholder="Enter your Old Password"
					error={errors.currentPassword?.message}
					{...register('currentPassword')}
				/>
				<button
					type="button"
					onClick={() => setShowOldPassword(prev => !prev)}
					className="absolute right-3 top-6 cursor-pointer text-gray-500"
				>
					{showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>
			<div className="relative">
				<InputField
					label="New Password"
					type={showNewPassword ? 'text' : 'password'}
					placeholder="Enter your New Password"
					error={errors.newPassword?.message}
					{...register('newPassword')}
				/>
				<button
					type="button"
					onClick={() => setShowNewPassword(prev => !prev)}
					className="absolute right-3 top-6 cursor-pointer text-gray-500"
				>
					{showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>
			<div className="relative">
				<InputField
					label="Confirm Password"
					type={showConfirmPassword ? 'text' : 'password'}
					placeholder="Enter your Confirm Password"
					error={errors.confirmPassword?.message}
					{...register('confirmPassword')}
				/>
				<button
					type="button"
					onClick={() => setShowConfirmPassword(prev => !prev)}
					className="absolute right-3 top-6 cursor-pointer text-gray-500"
				>
					{showConfirmPassword ? (
						<EyeOff size={20} />
					) : (
						<Eye size={20} />
					)}
				</button>
			</div>

			<Button
				type="submit"
				variant="primary"
				size="medium"
				fullWidth
				isLoading={isSubmitting}
			>
				Save Changes
			</Button>
		</form>
	);
}

export default ChangePassword;
