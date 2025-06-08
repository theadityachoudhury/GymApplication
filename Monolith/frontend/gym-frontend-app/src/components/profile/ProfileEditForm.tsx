import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { profileEditSchema, ProfileEditType } from '../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../common/form/InputFeild';
import useToast from '../../hooks/useToast';
import { UserPreferableActivity, UserTarget } from '@/types/auth/user.enum';
import Select from '../common/form/Select';
import Button from '../common/ui/CustomButton';
import { getAuthState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateUserProfile } from '@/store/slices/authSlice';
import { useEffect } from 'react';
import { UserDetails } from '@/types/user/user.type';

const ProfileEditForm = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { userDetail }: { userDetail: UserDetails | any } = useAppSelector(getAuthState);
	const dispatch = useAppDispatch();

	console.log(userDetail);

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
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<ProfileEditType>({
		resolver: zodResolver(profileEditSchema),
		defaultValues: {
			firstName: userDetail?.firstName,
			lastName: userDetail?.lastName,
			preferredActivity: userDetail?.preferredActivity,
			target: userDetail?.target,
		},
	});

	const { showToast } = useToast();

	const onSubmit: SubmitHandler<ProfileEditType> = async data => {
		try {
			console.log(data);
			const result = await dispatch(updateUserProfile(data)).unwrap();

			reset({
				firstName: result.firstName,
				lastName: result.lastName,
				preferredActivity: (result as UserDetails).preferredActivity,
				target: (result as UserDetails).target,
			});

			showToast({
				type: 'success',
				title: 'Profile Updated',
				description: 'Your profile has been successfully updated.',
			});
			reset();
		} catch (error) {
			console.log(error);
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
				firstName: userDetail.firstName || '',
				lastName: userDetail.lastName || '',
				preferredActivity: userDetail.preferredActivity,
				target: userDetail.target,
			});
		}
	}, [userDetail, reset]); // <-- depends on userDetail

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 mt-4 md:mt-8 space-y-3 w-full"
		>
			<div className="grid grid-cols-2 gap-3">
				<InputField
					label="First Name"
					type="text"
					placeholder="Enter your First Name"
					helperText="eg. Jonson"
					error={errors.firstName?.message}
					{...register('firstName')}
				/>
				<InputField
					label="Last Name"
					type="text"
					placeholder="Enter your Last Name"
					helperText="eg. Doe"
					error={errors.lastName?.message}
					{...register('lastName')}
				/>
			</div>

			<Controller
				name="preferredActivity"
				control={control}
				render={({ field }) => (
					<Select
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
						label="Target"
						options={userTargetOptions}
						onChange={field.onChange}
						value={field.value}
						name={field.name}
					/>
				)}
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

export default ProfileEditForm;
