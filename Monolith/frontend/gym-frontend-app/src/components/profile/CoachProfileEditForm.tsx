import { getAuthState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { coachProfileEditSchema, CoachProfileEditType } from '@/schemas/auth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import InputField from '@/components/common/form/InputFeild';
import Button from '@/components/common/ui/CustomButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { CoachUserData } from '@/types/user/user.type';
import useToast from '@/hooks/useToast';
import TextAreaInputField from '@/components/common/form/TextAreaInputField';
import TagInputField from '@/components/common/form/TagInputField';
import FileUploadField from '@/components/common/form/FileUploadField';
import { useEffect, useState } from 'react';
import { updateCoachProfile } from '@/store/slices/authSlice';
import { SelectOption } from '../common/form/Select';
import { ApiWorkoutService } from '@/services/Workouts/apiWorkoutService';

const CoachProfileEditForm = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { userDetail }: { userDetail: CoachUserData | any } = useAppSelector(getAuthState);
	const { showToast } = useToast();
	const [certificates, setCertificates] = useState<File[]>([]);
	const dispatch = useAppDispatch()

	const [userPreferableActivityOptions, setUserPreferableActivityOptions] =
		useState<SelectOption[]>([]);

	async function fetchWorkoutOptions() {
		const apiWorkout = new ApiWorkoutService();
		const { data } = await apiWorkout.getWrokoutOptions();
		console.log(data.data.workoutOptions)
		setUserPreferableActivityOptions(data.data.workoutOptions as SelectOption[]);
	}


	useEffect(() => {
		fetchWorkoutOptions();
	}, [])

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CoachProfileEditType>({
		resolver: zodResolver(coachProfileEditSchema),
		defaultValues: {
			firstName: userDetail?.firstName,
			lastName: userDetail?.lastName,
			title: userDetail?.title || 'Certified Yoga Trainer',
			about:
				userDetail?.about ||
				'I have 8 years of experience in the field, having studied various styles of yoga and completed rigorous training programs. I have taught diverse groups, from beginners to advanced practitioners, in both studio and private settings. I have regularly engaged in community events and wellness retreats,  inspiring others on their yoga journeys.',
			certificates: userDetail?.certificates || [],
			specialization: userDetail?.specialization,
		},
	});

	console.log(userDetail);


	const onSubmit: SubmitHandler<CoachProfileEditType> = async data => {
		try {
			console.log(data);
			const payload = {
				...data,
				specialization: data.specialization?.map(spec => spec.value) || [],
			};
			const result = await dispatch(updateCoachProfile(payload)).unwrap();
			console.log(result);

			reset({
				firstName: result.firstName,
				lastName: result.lastName,
				about: (result as CoachUserData).about,
				title: (result as CoachUserData).title,
				specialization: (result as CoachUserData).specialization || []
			});

			showToast({
				type: 'success',
				title: 'Profile Updated',
				description: 'Your profile has been successfully updated.',
			});
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
				title: userDetail.title,
				about: userDetail.about,
				specialization: userDetail.specialization
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
			<InputField
				label="Title"
				type="text"
				placeholder="Enter your title here"
				helperText="eg. Certified yoga trainer"
				error={errors.title?.message}
				{...register('title')}
			/>

			<TextAreaInputField
				label="About"
				placeholder="Enter about yourself here"
				error={errors.about?.message}
				{...register('about')}
				rows={8}
			/>

			{/* Specialization */}
			<Controller
				name="specialization"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<TagInputField
						label="Specialization"
						name={field.name}
						placeholder="Type and press enter"
						error={errors.specialization?.message}
						helperText="Eg: Yoga, Zumba, CrossFit"
						value={field.value}
						onChange={field.onChange}
						suggestions={userPreferableActivityOptions} // <-- pass suggestions
					/>
				)}
			/>

			<FileUploadField
				label="Add your certificates"
				files={certificates}
				onFilesChange={setCertificates}
				helperText="Upload PDF, Image, or Code files. Max size 5MB."
				accept=".pdf"
				multiple
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

export default CoachProfileEditForm;
