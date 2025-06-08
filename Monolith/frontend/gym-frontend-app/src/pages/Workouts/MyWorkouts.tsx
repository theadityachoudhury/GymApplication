/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import { getAuthState, useAppSelector } from '@/hooks/redux';
import useToast from '@/hooks/useToast';
import { ApiWorkoutService } from '@/services/Workouts/apiWorkoutService';
import { getWorkoutService } from '@/services/Workouts/workoutServiceFactory';
import { useEffect, useState, useTransition } from 'react';

const MyWorkouts = () => {
	const { user } = useAppSelector(getAuthState);
	const [workoutData, setWorkoutData] = useState<any[]>([]);

	const getBookedWorkouts = async () => {
		const { data } = await getWorkoutService().getBookedWorkouts();
		console.log(data);

		setWorkoutData(data);
	};

	const { showToast } = useToast();

	const [isPending, startTransition] = useTransition();
	useEffect(() => {
		startTransition(async () => {
			await getBookedWorkouts();
		});
	}, [user]);

	const handleCancelWorkout = async ({ bookingId }: { bookingId: string }) => {
		const workoutService = new ApiWorkoutService();
		// update the workoutData state to change the state
		setWorkoutData(workoutData.map(workout => {
			if (workout.bookingId === bookingId) {
				return { ...workout, state: 'cancelled' };
			}
			return workout;
		}));
		const { status, message } = await workoutService.cancelWorkout(bookingId);
		if (status === 201) {
			showToast({
				title: 'Success',
				type: 'success',
				description: message || 'Workout cancelled successfully',
			});
		} else {
			showToast({
				title: 'Error',
				type: 'error',
				description: message || 'Failed to cancel workout',
			});
		}
		await getBookedWorkouts();

	}

	const handleSubmitFeedback = async (workoutId: string, rating: number, comment: string) => {
		const workoutService = new ApiWorkoutService();
		const { status, message } = await workoutService.submitFeedback(workoutId, rating, comment);
		if (status === 201) {
			showToast({
				title: 'Success',
				type: 'success',
				description: message || 'Feedback submitted successfully',
			});
		} else {
			showToast({
				title: 'Error',
				type: 'error',
				description: message || 'Failed to submit feedback',
			});
		}
		await getBookedWorkouts();
	}

	if (isPending) {
		return <LoadingSpinner />;
	}

	return (
		<>
			{workoutData.length === 0 && (
				<div className="text-center text-gray-500  p-40">
					No workouts booked yet.
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mx-10">
				{workoutData.map(workout => {
					return <WorkoutCard setWorkoutData={setWorkoutData} workout={workout} key={workout.bookingId} onCancel={() => handleCancelWorkout(workout)} onFeedback={async (workoutId: string, rating: number, comment: string) => {
						console.log('onFeedback', workoutId, rating, comment);
						await handleSubmitFeedback(workoutId, rating, comment);

					}} />;
				})}
			</div>
		</>
	);
};

export default MyWorkouts;