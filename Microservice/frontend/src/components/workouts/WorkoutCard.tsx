/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { WorkoutState } from '@/types/workout/workout.type';
import { FeedbackDialog } from '../modals/FeedbackPopUp';
import { CustomAlertDialog } from '../modals/ConfirmationPopUp';
import Button from '@/components/common/ui/CustomButton';
import Kristin from '@/assets/coaches/Kristin.svg';

interface WorkoutCardProps {
	workout: any;
	onCancel?: () => void;
	onFeedback?: (id: string, rating: number, comment: string) => void;
	setWorkoutData: React.Dispatch<React.SetStateAction<any>>;
}

enum BtnState {
	scheduled = 'Cancel Workout',
	waiting_for_feedback = 'Leave Feedback',
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
	workout,
	onCancel,
	onFeedback,
	setWorkoutData
}) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const workoutDate = new Date(workout.date);
	workoutDate.setHours(
		parseInt(workout.timeSlot.startTime.split(':')[0]),
		parseInt(workout.timeSlot.startTime.split(':')[1]),
		0,
	);


	const formattedDate = workoutDate.toLocaleDateString('en-IN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	// Automatically update state to waiting_for_feedback if workout time has passed
	useEffect(() => {
		if (
			workout.state === WorkoutState.scheduled &&
			new Date() > workoutDate
		) {
			setWorkoutData((prevState: any) => {
				return prevState.map((w: any) =>
					w.bookingId === workout.bookingId
						? { ...w, state: WorkoutState.waiting_for_feedback }
						: w
				);
			});
		}
	}, [workout, setWorkoutData, workoutDate]);

	const renderStatusBadge = (state: WorkoutState) => {
		const colorMap: Record<WorkoutState, string> = {
			scheduled: 'bg-blue-400',
			waiting_for_feedback: 'bg-purple-400',
			completed: 'bg-green-400',
			cancelled: 'bg-gray-400',
		};

		return (
			<span
				className={`text-white text-sm text-center px-3 py-1 rounded-full ${colorMap[state]}`}
			>
				{state
					.replace(/_/g, ' ')
					.toLowerCase()
					.replace(/^\w/, c => c.toUpperCase())}
			</span>
		);
	};

	const handleCancelWorkout = () => {
		setWorkoutData((prevState: any) => {
			return prevState.map((workouts: any) => {
				if (workouts.bookingId === workout.bookingId) {
					return { ...workouts, state: 'cancelled' };
				}
				return workout;
			});
		});
		onCancel?.();
	};

	const handleSubmitFeedback = (rating: number, comment: string) => {
		onFeedback?.(workout.bookingId, rating, comment);
	};

	const shouldShowButton =
		workout.state === WorkoutState.scheduled ||
		workout.state === WorkoutState.waiting_for_feedback;

	return (
		<div className="flex flex-col justify-around rounded-xl border border-gray-200 shadow-sm p-6 w-full bg-white">
			<div className="flex justify-between items-start mb-2">
				<h2 className="text-xl font-semibold text-gray-800">
					{workout.activity.name}
				</h2>
				{renderStatusBadge(workout.state)}
			</div>

			<p className="text-gray-600 mb-4">{workout.activity.description || "something"}</p>

			<div className="flex items-center text-gray-700 gap-2 mb-4">
				<CalendarIcon className="w-5 h-5" />
				<span className="font-semibold">{formattedDate}</span>
			</div>

			{shouldShowButton && (
				<div className="flex justify-end">
					{workout.state === WorkoutState.scheduled && (
						<CustomAlertDialog
							title="Cancel Workout"
							description="You’re about to mark this workout as canceled. Are you sure you want to cancel this session? Any progress or data from this workout will not be saved."
							trigger={
								<Button variant="red" className="text-sm">
									{BtnState[WorkoutState.scheduled]}
								</Button>
							}
							onCancel={handleCancelWorkout}
							confirmText="Resume Workout"
							cancelText="Cancel Workout"
						/>
					)}

					{workout.state === WorkoutState.waiting_for_feedback && (
						<FeedbackDialog
							trigger={
								<Button variant="outline" className="text-sm">
									{BtnState[WorkoutState.waiting_for_feedback]}
								</Button>
							}
							onSubmit={handleSubmitFeedback}
						>
							<div className="flex flex-col xl:flex-row gap-6">
								{/* Coach Info */}
								<div className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-1">
									<div>
										<img
											src={Kristin}
											alt={`Kristin Watson`}
											className="rounded-full w-32 h-32 object-cover"
										/>
									</div>

									<div className="flex flex-col items-center text-center md:text-left lg:space-y-5 md:items-start">
										<div>
											<h2 className="text-2xl font-semibold text-neutral-700">
												Kristin Watson
											</h2>
											<p className="text-neutral-700">
												Certified Personal Yoga Trainer
											</p>
										</div>

										<div className="flex items-center mt-1">
											<span className="text-xl font-medium mr-1 text-neutral-700">
												4.96
											</span>
											<svg
												className="w-5 h-5 text-yellow-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										</div>
									</div>
								</div>

								{/* Booking Info */}
								<div className="mt-4 md:mt-0">
									<div className="space-y-3">
										<div className="flex items-start">
											<div className="text-gray-400 mr-2">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
												</svg>
											</div>
											<div>
												<span className="font-medium">Type:</span>
												<span className="ml-1">Yoga</span>
											</div>
										</div>

										<div className="flex items-start">
											<div className="text-gray-400 mr-2">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											<div>
												<span className="font-medium">Time:</span>
												<span className="ml-1">60 min</span>
											</div>
										</div>

										<div className="flex items-start">
											<div className="text-gray-400 mr-2">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
											<div>
												<span className="font-medium">Date:</span>
												<span className="ml-1">15-04-2025</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</FeedbackDialog>
					)}
				</div>
			)}
		</div>
	);
};

export default WorkoutCard;
