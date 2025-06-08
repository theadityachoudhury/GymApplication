// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { delay } from '../../helpers/utils/delay';
import {
	coachAvailableTimeSlots,
	coaches,
	coachesDetailedData,
} from '../../MockData/coaches';
import { feedbacks } from '../../MockData/feedback';
import { coachDetailedType, coachesType } from '../../types/coaches.type';
import {
	CoachesResponse,
	ICoachesService,
	SortByValues,
} from '../../types/coaches/coachesService.interface';
import { feedbackType } from '../../types/feedback/feedbacks.type';

export class MockCoachesService implements ICoachesService {
	async getCoaches(): Promise<CoachesResponse<coachesType>> {
		await delay(1000);
		return {
			data: [...coaches],
			status: 200,
			message: 'Coaches fetched successfully',
		};
	}

	async getCoachDetailedById(
		id: string
	): Promise<CoachesResponse<coachDetailedType>> {
		// await delay(1000);
		const coachDetailed = coachesDetailedData.find(
			coach => coach.id === id
		);
		if (!coachDetailed) {
			return {
				data: [],
				status: 404,
				message: 'Coach detailed information not found',
			};
		}
		return {
			data: [coachDetailed],
			status: 200,
			message: 'Coach detailed information fetched successfully',
		};
	}
	async getCoachById(id: string): Promise<CoachesResponse<coachesType>> {
		// await delay(1000);
		const coach = coaches.find(coach => coach.id === id);
		if (!coach) {
			return {
				data: [],
				status: 404,
				message: 'Coach not found',
			};
		}
		return {
			data: [coach],
			status: 200,
			message: 'Coach fetched successfully',
		};
	}

	async getCoachTimeSlots(
		id: string,
		date: string
	): Promise<CoachesResponse<string>> {
		// await delay(1000);
		console.log(id, date);

		const timeSlots = coachAvailableTimeSlots[id][date];
		if (!timeSlots) {
			return {
				data: [],
				status: 404,
				message: 'Time slots not found',
			};
		}
		const availableSlots = Object.values(timeSlots).flat();
		return {
			data: availableSlots,
			status: 200,
			message: 'Time slots fetched successfully',
		};
	}

	async getCoachFeedback(data: {
		id: string;
		pageNumber: number;
		pageSize: number;
		sortBy: SortByValues;
	}): Promise<CoachesResponse<feedbackType>> {
		await delay(1000);
		const feedback = feedbacks[data.id];
		if (!feedback) {
			return Promise.resolve({
				data: [],
				status: 404,
				message: 'Feedback not found',
			});
		}
		const sortedFeedback = [...feedback].sort((a, b) => {
			const A = parseInt(a.rating);
			const B = parseInt(b.rating);
			if (data.sortBy === SortByValues.RATING_ASC) {
				return A - B;
			} else if (data.sortBy === SortByValues.RATING_DESC) {
				return B - A;
			} else if (data.sortBy === SortByValues.DATE_ASC) {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			} else if (data.sortBy === SortByValues.DATE_DESC) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			return 0;
		});
		const startIndex = (data.pageNumber - 1) * data.pageSize;
		const endIndex = startIndex + data.pageSize;
		const paginatedFeedback = sortedFeedback.slice(startIndex, endIndex);
		return {
			data: paginatedFeedback,
			currentPage: data.pageNumber,
			totalPages: Math.ceil(feedback.length / data.pageSize),
			totalElements: feedback.length,
			status: 200,
			message: 'Feedback fetched successfully',
		};
	}
}
