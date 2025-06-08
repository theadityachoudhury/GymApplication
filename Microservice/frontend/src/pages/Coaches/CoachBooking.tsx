/* eslint-disable @typescript-eslint/no-explicit-any */
import CalendarContainer from '@/components/common/form/Calendar';
import CoachProfileCard from '@/components/coaches/CoachProfileCard';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import FeedbackSection from '@/components/common/feedback/FeedbackSection';
import TimeSlotSelector from '@/components/common/form/TimeSelector';
import UpcomingWorkouts from '@/components/workouts/UpcomingWorkouts';
import { getAuthState } from '@/hooks/redux';
import { getCoachesState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
	fetchCoachById,
	fetchCoachDetailedById,
	fetchCoachTimeSlots,
} from '@/store/slices/coachSlice';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ApiCoachesService } from '@/services/Coaches/apiCoachesService';
import { Workout } from '@/types/workout/workout.type';
import useToast from '@/hooks/useToast';
import { delay } from '@/helpers/utils/delay';

function CoachBooking() {
	const { isAuthenticated } = useAppSelector(getAuthState);

	const { coachId } = useParams<{ coachId: string }>();

	const dispatch = useAppDispatch();
	const coach = useAppSelector(getCoachesState);

	useEffect(() => {
		if (coachId) {
			async function fetchCoachByIdApi() {
				dispatch(fetchCoachById(coachId!)).unwrap();
				await Promise.all([
					// dispatch(fetchCoachTimeSlots({ id: coachId!, date: "2024-07-04" })),
					dispatch(fetchCoachDetailedById(coachId!)),
				]);
			}

			fetchCoachByIdApi();
		}
	}, [dispatch, coachId]);

	const navigate = useNavigate();
	const { showToast } = useToast();

	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
		null
	);
	const handleTimeSlotSelect = (slot: string) => {
		setSelectedTimeSlot(slot);
	};
	console.log(selectedTimeSlot);
	console.log(coach);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const formatDateToYYYYMMDD = (date: Date) => {
		return date.toISOString().split('T')[0];
	};

	const [upcomingWorkouts, setUpcomingWorkouts] = useState<Workout[]>([]);
	const fetchUpcomingWorkouts = async () => {
		const data = await new ApiCoachesService().getUpcomingWorkouts();
		setUpcomingWorkouts(data);
	};

	console.log(upcomingWorkouts);

	useEffect(() => {
		if (isAuthenticated)
			fetchUpcomingWorkouts().then();
	}, [coachId, isAuthenticated]);

	useEffect(() => {
		async function fetchTimeSlot() {
			dispatch(
				fetchCoachTimeSlots({
					id: coachId!,
					date: new Date(selectedDate).toLocaleDateString(),
				})
			).unwrap();
		}

		fetchTimeSlot();
	}, [selectedDate, dispatch, coachId]);

	// console.log(coach.selectedCoach, coach.availableTimeSlots, coach.feedback, coach.selectedCoachDetailed);
	// console.log(selectedDate, selectedDate.toISOString());
	// console.log(coach.availableTimeSlots);
	if (coach.loading.selectedCoachDetailed) return <LoadingSpinner />;

	if (coach.selectedCoachDetailed)
		return (
			<div className="p-5 px-6">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-neutral-700 mb-4">
					<a href="/coaches" className="hover:text-primary-green">
						Coaches
					</a>
					<span>&gt;</span>
					<span className="text-gray-800 font-semibold">
						{coach.selectedCoachDetailed.name}
					</span>
				</nav>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-1 gap-8">
					<div className="col-span-1">
						<CoachProfileCard
							{...coach.selectedCoachDetailed!}
							sessionType={
								coach.selectedCoachDetailed.specializations.length > 0 &&
								(coach.selectedCoachDetailed.specializations[0] as any).name
							}
							mainSessionDate={
								<span>
									{formatDateToYYYYMMDD(selectedDate)}
								</span>
							}
							sessionDuration="60 minutes"
							onBookWorkout={async () => {
								if (!isAuthenticated) return;
								showToast({
									type: 'success',
									description: 'Workout Booking is not available here. You will be redirected to the booking page.',
									title: 'Booking',
								});
								await delay(1000);
								navigate("/");

							}}
						/>
					</div>

					<div className="md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col gap-4 place-items-center">
						<div className="w-full">
							<h3>Schedule</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-1 md:gap-4 place-items-start w-full">
								<CalendarContainer
									selectedDate={selectedDate}
									onDateSelect={setSelectedDate}
									{...(isAuthenticated && {
										bookedDates: upcomingWorkouts.map((slots: any) => {
											return new Date(slots.date.split(',')[0]);
										}),
									})}
								// disabledDates={} // Pass disabled dates to CalendarContainer
								/>
								<TimeSlotSelector
									date={formatDateToYYYYMMDD(selectedDate)}
									timeSlots={coach.availableTimeSlots}
									onSlotSelect={handleTimeSlotSelect}
									selectedSlot={selectedTimeSlot}
								/>
							</div>
						</div>

						{isAuthenticated && (
							<div className="w-full">
								<UpcomingWorkouts
									workouts={upcomingWorkouts as any[]}
								/>
							</div>
						)}

						{!isAuthenticated && (
							<div className="w-full mx-auto">
								<h2 className="text-xs uppercase text-gray-500 mb-4">
									Upcoming Workouts
								</h2>
								<div className="bg-[#F3FAFF] p-4 rounded border-l-8 border-[#A0D8FD]">
									Please log in to view your upcoming
									workouts.
								</div>
							</div>
						)}

						<div className="w-full md:hidden lg:block">
							<FeedbackSection coachId={coachId} />
						</div>
					</div>
				</div>
				<div className="hidden md:block lg:hidden md:pt-4">
					<FeedbackSection coachId={coachId} />
				</div>
			</div>
		);
}

export default CoachBooking;
