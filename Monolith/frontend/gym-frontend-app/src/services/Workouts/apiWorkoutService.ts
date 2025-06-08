// src/services/Workout/apiWorkoutService.ts

import {
	IWorkoutService,
	workoutFilters,
	WorkoutResponse,
	WorkoutType,
} from '../../types/workout/workoutService.interface';
import { CoachWorkoutAvailability } from '../../types/workout/workout.type';
import { AxiosError } from 'axios';
import { apiClient } from '@/services/api/axiosInstance';

export class ApiWorkoutService implements IWorkoutService {
	/**
	 * Get booked workouts for a client
	 */
	async getBookedWorkouts(): Promise<WorkoutResponse<WorkoutType>> {
		try {
			// Make API call to get booked workouts
			const response = await apiClient.axios.get(`/gym/workouts/bookings`);

			return {
				data: response.data.data || [],
				status: response.status,
				message:
					response.data.message ||
					'Booked workouts fetched successfully',
			};
		} catch (error) {
			console.error('Error fetching booked workouts:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to fetch booked workouts';

			return {
				data: [],
				status,
				message,
			};
		}
	}

	/**
	 * Get available workouts based on filters
	 */
	async getAvailableWorkouts(
		filters: workoutFilters
	): Promise<WorkoutResponse<CoachWorkoutAvailability>> {
		try {
			console.log(filters);

			// Build query parameters from filters
			const queryParams = new URLSearchParams();

			if (filters.workoutId) {
				queryParams.append('workoutId', filters.workoutId);
			}

			if (filters.coachId && filters.coachId.toUpperCase() !== 'ALL') {
				queryParams.append('coachId', filters.coachId);
			}

			if (filters.date) {
				queryParams.append('date', filters.date);
			}

			if (filters.timeSlotId) {
				queryParams.append('timeSlotId', filters.timeSlotId);
			}

			// Make API call to get available workouts
			const response = await apiClient.axios.get(
				`/gym/workouts/available?${queryParams.toString()}`
			);

			return {
				data: response.data.data || [],
				status: response.status,
				message:
					response.data.message ||
					'Available workouts fetched successfully',
			};
		} catch (error) {
			console.error('Error fetching available workouts:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to fetch available workouts';

			return {
				data: [],
				status,
				message,
			};
		}
	}

	/**
	 * Book a workout
	 */
	async bookWorkout(
		workoutId: string,
		coachId: string,
		timeSlotId: string,
		date: string
	): Promise<WorkoutResponse<WorkoutType>> {
		try {
			const response = await apiClient.axios.post('/gym/workouts/book', {
				workoutId,
				coachId,
				timeSlotId,
				date
			});

			return {
				data: response.data.data,
				status: response.status,
				message: response.data.message || 'Workout booked successfully',
			};
		} catch (error) {
			console.error('Error booking workout:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to book workout';

			return {
				data: null as unknown as WorkoutType[],
				status,
				message,
			};
		}
	}

	/**
	 * Cancel a booked workout
	 */
	async cancelWorkout(
		bookingId: string
	): Promise<WorkoutResponse<null>> {
		try {
			const response = await apiClient.axios.delete(`/gym/workouts/${bookingId}`);

			return {
				data: null as unknown as null[],
				status: response.status,
				message:
					response.data.message || 'Workout cancelled successfully',
			};
		} catch (error) {
			console.error('Error cancelling workout:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to cancel workout';

			return {
				data: null as unknown as null[],
				status,
				message,
			};
		}
	}

	/**
	 * Get workout details by ID
	 */
	async getWorkoutById(
		workoutId: string
	): Promise<WorkoutResponse<WorkoutType>> {
		try {
			const response = await apiClient.axios.get(
				`/gym/workouts/${workoutId}`
			);

			return {
				data: response.data.data,
				status: response.status,
				message:
					response.data.message ||
					'Workout details fetched successfully',
			};
		} catch (error) {
			console.error('Error fetching workout details:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to fetch workout details';

			return {
				data: null as unknown as WorkoutType[],
				status,
				message,
			};
		}
	}

	async getWrokoutOptions() {
		try {
			const response = await apiClient.axios.get(
				'/gym/workouts/workout-options'
			);
			console.log(response);

			return {
				data: response.data || [],
				status: response.status,
				message:
					response.data.message ||
					'Available workouts Options fetched successfully',
			};
		} catch (error) {
			console.error('Error fetching available workouts:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to fetch workouts options';

			return {
				data: [],
				status,
				message,
			};
		}
	}

	/**
	 * Submit feedback for a workout
	 */
	async submitFeedback(
		bookingId: string,
		rating: number,
		message: string
	): Promise<WorkoutResponse<null>> {
		try {
			const response = await apiClient.axios.post(
				`/gym/feedback`,
				{
					bookingId,
					rating,
					message,
				}
			);

			return {
				data: null as unknown as null[],
				status: response.status,
				message:
					response.data.message || 'Feedback submitted successfully',
			};
		} catch (error) {
			console.error('Error submitting feedback:', error);

			const axiosError = error as AxiosError;
			const status = axiosError.response?.status || 500;
			const message =
				axiosError.response?.data &&
					typeof axiosError.response.data === 'object' &&
					'message' in axiosError.response.data
					? (axiosError.response.data.message as string)
					: 'Failed to submit feedback';

			return {
				data: null as unknown as null[],
				status,
				message,
			};
		}
	}
}
