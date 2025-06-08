import { coachDetailedType, coachesType } from './coaches.type';
import { feedbackType } from '../feedback/feedbacks.type';

export interface CoachesResponse<T> {
	data: T[];
	currentPage?: number;
	totalPages?: number;
	totalElements?: number;
	status: number;
	message?: string;
}

export enum SortByValues {
	RATING_ASC = 'RATING_ASC',
	RATING_DESC = 'RATING_DESC',
	DATE_ASC = 'DATE_ASC',
	DATE_DESC = 'DATE_DESC',
}

export type getFeedBackPropsType = {
	id: string;
	pageNumber: number;
	pageSize: number;
	sortBy: SortByValues;
};

export interface ICoachesService {
	getCoaches(): Promise<CoachesResponse<coachesType>>;
	getCoachById(id: string): Promise<CoachesResponse<coachesType>>;
	getCoachTimeSlots(
		id: string,
		date: string
	): Promise<CoachesResponse<string>>;
	getCoachFeedback(
		data: getFeedBackPropsType
	): Promise<CoachesResponse<feedbackType>>;
	getCoachDetailedById(
		id: string
	): Promise<CoachesResponse<coachDetailedType>>;
}
