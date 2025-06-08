/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
// src/services/Coaches/apiCoachesService.ts
import { SelectOption } from '@/components/common/form/Select';
import {
	coachDetailedType,
	coachesType,
} from '../../types/coaches/coaches.type';
import {
	CoachesResponse,
	ICoachesService,
	SortByValues,
	getFeedBackPropsType,
} from '../../types/coaches/coachesService.interface';
import { feedbackType } from '../../types/feedback/feedbacks.type';
import { axiosInstance } from '@/services/api/axiosInstance';

export class ApiCoachesService implements ICoachesService {
	private api = axiosInstance;

	constructor() {
		// Add request interceptor to include auth token
		this.api.interceptors.request.use(
			config => {
				const token = localStorage.getItem('token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			error => Promise.reject(error)
		);
	}

	async getCoaches(): Promise<CoachesResponse<coachesType>> {
		try {
			const response = await this.api.get('/gym/coaches');

			// Map the API response to match your frontend model
			const coaches: coachesType[] = response.data.data.map(
				(coach: any) => ({
					id: coach.id,
					imageUrl: coach.image || '',
					motivationPitch: coach.title || '',
					name: `${coach.firstName} ${coach.lastName}`,
					rating: coach.rating || 0,
					summary: coach.about || '',
					specializations: coach.specializations || [],
				})
			);

			return {
				data: coaches,
				status: response.status,
				message: 'Coaches fetched successfully',
			};
		} catch (error: any) {
			console.error('Error fetching coaches:', error);
			return {
				data: [],
				status: error.response?.status || 500,
				message:
					error.response?.data?.message || 'Failed to fetch coaches',
			};
		}
	}

	async getCoachById(id: string): Promise<CoachesResponse<coachesType>> {
		try {
			const response = await this.api.get(`/gym/coaches/${id}`);

			// Map the API response to match your frontend model
			const coach: coachesType = {
				id: response.data.data.id,
				imageUrl: response.data.data.image || '',
				motivationPitch: response.data.data.title || '',
				name: `${response.data.data.firstName} ${response.data.data.lastName}`,
				rating: response.data.data.rating || 0,
				summary: response.data.data.about || '',
				specializations: response.data.data.specializations,
			};

			return {
				data: [coach],
				status: response.status,
				message: 'Coach fetched successfully',
			};
		} catch (error: any) {
			console.error('Error fetching coach:', error);
			return {
				data: [],
				status: error.response?.status || 500,
				message:
					error.response?.data?.message || 'Failed to fetch coach',
			};
		}
	}

	async getCoachDetailedById(
		id: string
	): Promise<CoachesResponse<coachDetailedType>> {
		try {
			const response = await this.api.get(`/gym/coaches/${id}`);

			// Map the API response to match your frontend model
			const coachDetailed: coachDetailedType = {
				id: response.data.data.id,
				name: `${response.data.data.firstName} ${response.data.data.lastName}`,
				image: response.data.data.image || '',
				title: response.data.data.title || '',
				rating: response.data.data.rating || 0,
				about: response.data.data.about || '',
				specializations: response.data.data.specializations || [],
				certificates:
					response.data.data.certificates?.map((cert: any) => ({
						name: cert.name || cert,
						url: cert.url || '',
					})) || [],
				education: response.data.data.education || '',
				experience: response.data.data.experience || '',
				languages: response.data.data.languages || [],
			};

			return {
				data: [coachDetailed],
				status: response.status,
				message: 'Coach detailed information fetched successfully',
			};
		} catch (error: any) {
			console.error('Error fetching coach details:', error);
			return {
				data: [],
				status: error.response?.status || 500,
				message:
					error.response?.data?.message ||
					'Failed to fetch coach details',
			};
		}
	}

	async getCoachTimeSlots(
		id: string,
		date: string,
		everything: boolean = false
	): Promise<CoachesResponse<SelectOption>> {
		try {
			const response = await this.api.get(`/gym/coaches/${id}/time-slots`, {
				params: { date },
			});

			// Map the time slots to match your frontend model
			if (everything) {
				return {
					data: response.data.data.map((slot: any) => {
						return {
							label: slot.startTime,
							value: slot.id,
						};
					}),
					status: response.status,
					message: 'Time slots fetched successfully',
				};
			}
			const timeSlots = response.data.data
				.map((slot: any) => {
					// If the slot is not booked, return the time slot
					if (!slot.isBooked) {
						return `${slot.startTime} - ${slot.endTime}`;
					}
					return null;
				})
				.filter(Boolean); // Remove null values

			return {
				data: timeSlots,
				status: response.status,
				message: 'Time slots fetched successfully',
			};
		} catch (error: any) {
			console.error('Error fetching time slots:', error);
			return {
				data: [],
				status: error.response?.status || 500,
				message:
					error.response?.data?.message ||
					'Failed to fetch time slots',
			};
		}
	}

	async getCoachFeedback(
		data: getFeedBackPropsType
	): Promise<CoachesResponse<feedbackType>> {
		try {
			// Map sortBy values to backend expected values
			let sortBy = 'timestamp'; // default sort

			switch (data.sortBy) {
				case SortByValues.DATE_DESC:
					sortBy = 'timestamp';
					break;
				case SortByValues.DATE_ASC:
					sortBy = 'timestamp_asc';
					break;
				case SortByValues.RATING_DESC:
					sortBy = 'rating';
					break;
				case SortByValues.RATING_ASC:
					sortBy = 'rating_asc';
					break;
			}

			const response = await this.api.get(`/gym/feedback/coach/${data.id}`, {
				params: {
					page: data.pageNumber,
					perPage: data.pageSize,
					sortBy: sortBy,
				},
			});

			// Extract feedback data from the response
			const feedbackData = response.data.data;

			// Transform the feedback data to match your frontend model
			const mappedFeedback: feedbackType[] = feedbackData.feedback.map(
				(item: any) => {
					// Handle the case where latestFeedback is null
					const latestFeedback =
						item.latestFeedback ||
						(item.fullHistory && item.fullHistory.length > 0
							? item.fullHistory[0]
							: null);

					// Get the most recent feedback from history if available
					const historyItem =
						item.fullHistory && item.fullHistory.length > 0
							? item.fullHistory[0]
							: null;

					return {
						id: item.feedbackId,
						userId: item.from.id,
						userName: item.from.name,
						userImage: item.from.image || '',
						// Use rating from latestFeedback, history, or default to '0'
						rating: (
							latestFeedback?.rating ||
							historyItem?.rating ||
							'0'
						).toString(),
						// Use message from latestFeedback, history, or default to empty string
						comment:
							latestFeedback?.message ||
							historyItem?.message ||
							'No feedback message provided',
						// Use timestamp from latestFeedback, history, or current date
						date:
							new Date(latestFeedback?.timestamp)
								.toISOString()
								.split('T')[0] ||
							new Date(historyItem?.timestamp)
								.toISOString()
								.split('T')[0] ||
							new Date().toISOString().split('T')[0],
						// Include empty history flag for UI handling
						emptyFeedback:
							!latestFeedback &&
							(!historyItem || item.historyCount === 0),
					};
				}
			);

			return {
				data: mappedFeedback,
				currentPage: feedbackData.currentPage,
				totalPages: feedbackData.totalPages,
				totalElements: feedbackData.total,
				status: response.status,
				message: 'Feedback fetched successfully',
				// Include average rating from API response
				averageRating: feedbackData.averageRating,
			};
		} catch (error: any) {
			console.error('Error fetching feedback:', error);
			return {
				data: [],
				currentPage: data.pageNumber,
				totalPages: 0,
				totalElements: 0,
				status: error.response?.status || 500,
				message:
					error.response?.data?.message || 'Failed to fetch feedback',
				averageRating: 0,
			};
		}
	}

	async getUpcomingWorkouts() {
		try {
			const todaysDate = new Date().toLocaleDateString();
			const { data } = await this.api.get(
				`/gym/coaches/bookings/day?date=${todaysDate}`
			);

			const upcomingWorkouts = data.data.map((workout: any) => {
				return {
					bookingId: workout.bookingId,
					date: `${workout.date.split('T')[0]}, ${workout.timeSlot.startTime}`,
					duration: '1 hour',
					title: workout.activity.name,
				};
			});

			return upcomingWorkouts;
		} catch (error) {
			console.error('Error fetching upcoming workouts:', error);
			return [];
		}
	}
}
