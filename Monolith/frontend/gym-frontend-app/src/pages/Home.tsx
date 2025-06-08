import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select, { SelectOption } from '@/components/common/form/Select';
import IntegratedDatePicker from '@/components/common/form/DatePickerField';
import Button from '@/components/common/ui/CustomButton';
import { searchSchema, searchSchemaData } from '@/schemas/search';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { CoachWorkoutAvailability } from '@/types/workout/workout.type';
import WorkoutBookingCard from '@/components/workouts/WorkoutBookingCard';
import Underline from '../assets/Images/Underline.png';
import Arrow from '../assets/Images/Arrow.png';
import { workoutFilters } from '@/types/workout/workoutService.interface';
import { useNavigate } from 'react-router';
import NoWorkout from '../assets/Images/Illustration.svg';
import { getAuthState, useAppSelector } from '@/hooks/redux';
import { Role } from '@/types/auth/user.enum';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import { ApiWorkoutService } from '@/services/Workouts/apiWorkoutService';
import {
	formatTimeForDisplay,
	getPeriod,
} from '@/helpers/utils/formatTimeForDisplay';
import { ApiCoachesService } from '@/services/Coaches/apiCoachesService';
import useToast from '@/hooks/useToast';
import { delay } from '@/helpers/utils/delay';

// Define the type for our form data

const Home = () => {
	const navigate = useNavigate();
	const { showToast } = useToast();

	const { isAuthenticated, userDetail, user } = useAppSelector(getAuthState);
	const [isLoading, startLoading] = useTransition();
	const [timeSlots, setTimeSlots] = useState<SelectOption[]>([
		{
			value: 'ALL',
			label: 'All',
		},
	]);
	useEffect(() => {
		startLoading(() => {
			console.log(user?.role);
			if (isAuthenticated && (userDetail || user)) {
				if (userDetail?.role === Role.COACH || user?.role === Role.COACH) {
					navigate('/workouts');
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, userDetail, navigate]);

	// const timeOptions = [
	// 	{ value: 'ALL', label: 'All' },
	// 	{ value: '9:00', label: '9:00 AM' },
	// 	{ value: '10:00', label: '10:00 AM' },
	// 	{ value: '11:00', label: '11:00 AM' },
	// 	{ value: '13:00', label: '1:00 PM' },
	// 	{ value: '14:00', label: '2:00 PM' },
	// 	{ value: '15:00', label: '3:00 PM' },
	// ];
	const [userPreferableActivityOptions, setUserPreferableActivityOptions] =
		useState<SelectOption[]>([]);
	const [coachOptions, setCoachOptions] = useState<SelectOption[]>([]);

	const [searchData, setSearchData] = useState<CoachWorkoutAvailability[]>(
		[]
	);

	const [hasSearched, setHasSearched] = useState(false);
	const [showNoResults, setShowNoResults] = useState(false);
	useEffect(() => {
		if (hasSearched && searchData.length === 0) {
			const timer = setTimeout(() => {
				setShowNoResults(true);
			}, 1000);

			return () => clearTimeout(timer);
		} else {
			setShowNoResults(false);
		}
	}, [hasSearched, searchData]);

	const { control, handleSubmit, reset, formState, getValues, watch } =
		useForm<searchSchemaData>({
			resolver: zodResolver(searchSchema),
			defaultValues: {
				typeOfSport: '',
				time: timeSlots[0].value,
				coach: coachOptions[0]?.value,
				date: new Date(),
			},
		});

	// Form submission handler
	const onSubmit = async (data: searchSchemaData) => {
		setHasSearched(true);
		try {
			console.log(userPreferableActivityOptions, coachOptions);

			console.log('Booking data:', data);
			const options: workoutFilters = {
				date: data.date.toLocaleDateString(),
			};

			if (data.coach !== 'ALL') {
				options.coachId = data.coach;
			}

			if (data.typeOfSport !== 'ALL') {
				options.workoutId = data.typeOfSport;
			}

			if (data.time !== 'ALL') {
				options.timeSlotId = data.time;
			}

			console.log(options);

			const apiWorkout = new ApiWorkoutService();
			const response = await apiWorkout.getAvailableWorkouts(options);
			console.log(response);

			if (response.status === 200) setSearchData(response.data);
			else {
				setSearchData([]);
				// alert(response.message);
				showToast({
					type: 'error',
					title: 'Error',
					description: response.message || 'Internal server error',
				});
			}
			// Process your form submission here
		} catch (error) {
			console.error('Booking failed:', error);
			showToast({
				type: 'error',
				title: 'Update Failed',
				description: error as string,
			});
		}
	};

	async function fetchWorkoutOptions() {
		const apiWorkout = new ApiWorkoutService();
		const { data: { data } } = await apiWorkout.getWrokoutOptions();
		console.log(data);

		setUserPreferableActivityOptions([
			{ label: 'ALL', value: 'ALL' },
			...(data.workoutOptions as SelectOption[]),
		]);
		setCoachOptions([
			{ label: 'ALL', value: 'ALL' },
			...(data.coachOptions as SelectOption[]),
		]);

		// Now reset the form with first options
		reset({
			typeOfSport: data.workoutOptions[0].value,
			time: 'ALL',
			coach: data.coachOptions[0].value,
			date: new Date(),
		});
	}

	const fetchTimeSlots = useCallback(async () => {
		const apiWorkout = new ApiCoachesService();
		const { data } = await apiWorkout.getCoachTimeSlots(
			coachOptions[1].value,
			new Date().toLocaleDateString(),
			true
		);
		setTimeSlots([...timeSlots, ...data]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coachOptions, timeSlots, watch("date")]);

	useEffect(() => {
		fetchWorkoutOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log(coachOptions)
		if (coachOptions.length > 0) {
			fetchTimeSlots();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coachOptions, watch("date")]);

	const handleBooking = async ({ workoutId, coachId, timeSlotId, date }: { workoutId: string, coachId: string, timeSlotId: string, date: string }) => {
		console.log(workoutId, coachId, timeSlotId, date);
		const apiWorkout = new ApiWorkoutService();
		const response = await apiWorkout.bookWorkout(
			workoutId,
			coachId,
			timeSlotId,
			date
		);
		if (response.status === 201) {
			showToast({
				type: 'success',
				title: 'Success',
				description: response.message || 'Workout booked successfully',
			});
			await delay(1000);
			navigate('/workouts');
		} else {
			showToast({
				type: 'error',
				title: 'Error',
				description: response.message || 'Internal server error',
			});
		}

	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<>
			<div className="mx-4 sm:mx-8 md:mx-12">
				<section className="mt-8 mb-8 relative">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 inline-block relative">
						Achieve your{' '}
						<span className="text-gray-900">fitness goals!</span>
						<img
							src={Underline}
							alt="underline"
							className="absolute left-3/4 transform -translate-x-1/2 bottom-[-10px] w-1/2 hidden xl:block"
						/>
					</h1>
					<br />
					<p className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-800 mt-6 inline-block relative">
						Find a workout and book today.
						<img
							src={Arrow}
							alt="arrow"
							className="absolute -right-24 top-6 w-22 hidden xl:block"
						/>
					</p>
				</section>

				<h1 className="text-lg font-light uppercase mb-6">
					Book a workout
				</h1>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Responsive form layout that maintains original desktop design */}
					<div className="flex flex-col md:flex-col lg:flex-row gap-4 items-start">
						<div className="w-full">
							<Controller
								name="typeOfSport"
								control={control}
								render={({ field }) => (
									<Select
										size="medium"
										variant="primary"
										fullWidth
										options={userPreferableActivityOptions}
										onChange={field.onChange}
										value={field.value}
										name={field.value}
										label="Type of sport"
									/>
								)}
							/>
						</div>

						<div className="w-full md:w-full lg:w-[75%]">
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<IntegratedDatePicker
										selectedDate={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</div>

						<div className="w-full md:w-full lg:w-[75%]">
							<Controller
								name="time"
								control={control}
								render={({ field }) => (
									<Select
										size="medium"
										variant="primary"
										fullWidth
										options={timeSlots}
										onChange={field.onChange}
										value={field.value}
										name={field.name}
										label="Time"
									/>
								)}
							/>
						</div>

						<div className="w-full">
							<Controller
								name="coach"
								control={control}
								render={({ field }) => (
									<Select
										size="medium"
										variant="primary"
										fullWidth
										options={coachOptions}
										onChange={field.onChange}
										value={field.value}
										name={field.name}
										label="Coach"
									/>
								)}
							/>
						</div>

						{/* Button that's centered on tablet, but maintains original position on desktop */}
						<div className="w-full md:flex md:justify-center md:mt-4 lg:mt-2 lg:justify-start lg:w-[75%]">
							<div className="w-full md:w-1/2 lg:w-full">
								<Button
									type="submit"
									variant="primary"
									size="medium"
									fullWidth
									isLoading={formState.isSubmitting}
									className="bg-lime-400 hover:bg-lime-500 text-black font-medium"
									disabled={formState.isSubmitting}
								>
									Find Workout
								</Button>
							</div>
						</div>
					</div>
				</form>

				{searchData && searchData.length > 0 && (
					<div className="my-5 space-y-10">
						<p className="uppercase">Available Workouts</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
							{searchData &&
								searchData.map(workout => {
									return (
										<WorkoutBookingCard
											coachName={`${workout.firstName} ${workout.lastName}`}
											description={workout.about}
											alternativeSlots={workout.alternativeTimeSlots.map(
												slot => {
													const startFormatted =
														formatTimeForDisplay(
															slot.startTime
														);
													const endFormatted =
														formatTimeForDisplay(
															slot.endTime
														);
													const period = getPeriod(
														slot.startTime
													);
													return `${startFormatted} - ${endFormatted} ${period}`;
												}
											)}
											// alternativeSlots={['9:00-10:00 AM', '10:00-11:00 AM', '3:00-4:00 PM', '4:00-5:00 PM']}
											coachTitle={workout.title}
											image={workout.image}
											mainSessionDate={getValues().date.toDateString()}
											onBookClick={async () => {
												// eslint-disable-next-line @typescript-eslint/no-explicit-any
												await handleBooking(workout as any);
											}
											}
											onProfileClick={() =>
												navigate(
													`/coaches/${workout.coachId}`
												)
											}
											rating={workout.rating}
											sessionDuration={`1 hour, ${workout.timeSlot?.split("-")[0]}`}
											sessionType={workout.workoutName}
											key={workout.workoutId}
										/>
									);
								})}
						</div>
					</div>
				)}
				{showNoResults && (
					<div className="flex flex-col items-center justify-center mt-10 text-center">
						<img
							src={NoWorkout}
							alt="No workouts"
							className="w-32 h-32 mb-4"
						/>
						<p className="text-xl font-semibold text-gray-700">
							No workouts available
						</p>
						<p className="text-sm text-gray-500 mt-2">
							It looks like there are no available slots. Please
							try refining your search.
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default Home;
