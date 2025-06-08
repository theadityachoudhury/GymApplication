import { CoachWorkoutAvailability, WorkoutState } from './workout.type';

export interface WorkoutResponse<T> {
	data: T[];
	status: number;
	message?: string;
}

export type workoutFilters = {
	workoutId?: string;
	date?: string;
	timeSlotId?: string;
	coachId?: string;
};

export type workoutBookingProps = {
	clientId: string;
	coachId: string;
	date: string;
	timeSlot: string;
};

export type WorkoutType = {
	id: string;
	name: string;
	description: string;
	activity: string;
	coachId: string;
	clientId: string;
	dateTime: string;
	state: WorkoutState;
	feedbackId: string | null;
};

export type BookedWorkouts = {
	[userId: string]: WorkoutType[];
};

export interface IWorkoutService {
	getAvailableWorkouts(
		filters: workoutFilters
	): Promise<WorkoutResponse<CoachWorkoutAvailability>>;
	getBookedWorkouts(): Promise<WorkoutResponse<WorkoutType>>;
}
