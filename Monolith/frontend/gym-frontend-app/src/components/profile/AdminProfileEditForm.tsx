import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../common/form/InputFeild';
import Button from '../common/ui/CustomButton';
import useToast from '../../hooks/useToast';
import { getAuthState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateAdminProfile } from '@/store/slices/authSlice';
import { useEffect } from 'react';
import { adminProfileEditSchema, AdminProfileEditType } from '@/schemas/auth';
import { AdminUserData } from '@/types/user/user.type';

const AdminProfileEditForm = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { userDetail }: { userDetail: AdminUserData | any } = useAppSelector(getAuthState); // Make sure getAuthState returns userDetail
	const dispatch = useAppDispatch();
	const { showToast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AdminProfileEditType>({
		resolver: zodResolver(adminProfileEditSchema),
		defaultValues: {
			firstName: userDetail?.firstName ?? '',
			lastName: userDetail?.lastName ?? '',
			phoneNumber: userDetail?.phoneNumber ?? '',
		},
	});

	const onSubmit = async (data: AdminProfileEditType) => {
		try {
			console.log(data);
			
			const result = await dispatch(updateAdminProfile(data)).unwrap();
			showToast({
				type: 'success',
				title: 'Profile Updated',
				description: 'Your profile has been successfully updated.',
			});
			reset(result);
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Update Failed',
				description: error as string,
			});
		}
	};

	useEffect(() => {
		if (userDetail) {
			reset({
				firstName: userDetail.firstName ?? '',
				lastName: userDetail.lastName ?? '',
				phoneNumber: userDetail.phoneNumber ?? '',
			});
		}
	}, [userDetail, reset]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 mt-4 md:mt-8 w-full"
		>
			<div className="grid grid-cols-2 gap-3">
				<InputField
					label="First Name"
					type="text"
					placeholder="Enter your First Name"
					helperText="e.g. Jonson"
					error={errors.firstName?.message}
					{...register('firstName')}
				/>
				<InputField
					label="Last Name"
					type="text"
					placeholder="Enter your Last Name"
					helperText="e.g. Doe"
					error={errors.lastName?.message}
					{...register('lastName')}
				/>
			</div>

			<InputField
				label="Phone Number"
				type="tel"
				placeholder="Enter your Phone Number"
				helperText='e.g. +48 806 243 146'
				error={errors.phoneNumber?.message}
				{...register('phoneNumber')}
			/>

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
};

export default AdminProfileEditForm;
