import { SortByValues } from './coachesService.interface';
import { feedbackType } from '../feedback/feedbacks.type';
import { SelectOption } from '@/components/common/form/Select';

export enum Specialization {
	YOGA = 'YOGA',
	PILATES = 'PILATES',
	CARDIO = 'CARDIO',
	WEIGHTS = 'WEIGHTS',
	STRENGTH = 'STRENGTH',
	FLEXIBILITY = 'FLEXIBILITY',
}

export enum SpecializationSearchOption {
	ALL = 'ALL',
	YOGA = 'YOGA',
	PILATES = 'PILATES',
	CARDIO = 'CARDIO',
	WEIGHTS = 'WEIGHTS',
	STRENGTH = 'STRENGTH',
	FLEXIBILITY = 'FLEXIBILITY',
}

export type coachesType = {
	id: string;
	imageUrl: string;
	motivationPitch: string;
	name: string;
	rating: number;
	summary: string;
	specializations: SelectOption[];
};

interface Certificate {
	name: string;
	url: string;
}



// coachDetailed.type.ts
export interface coachDetailedType {
	id: string;
	name: string;
	image: string;
	title: string;
	rating: number;
	about: string;
	specializations: SelectOption[];
	certificates: Certificate[];
	education: string;
	experience: string;
	languages: string[];
}
export type TimeSlots = {
	[key: string]: {
		[key: string]: string[];
	};
};

// Define the state interface
export interface CoachesState {
	coaches: coachesType[];
	selectedCoach: coachesType | null;
	selectedCoachDetailed: coachDetailedType | null;
	availableTimeSlots: string[];
	feedback: {
		items: feedbackType[];
		currentPage: number;
		totalPages: number;
		totalElements: number;
		sortBy: SortByValues;
		pageSize: number;
	};
	loading: {
		coaches: boolean;
		selectedCoach: boolean;
		selectedCoachDetailed: boolean;
		timeSlots: boolean;
		feedback: boolean;
	};
	error: {
		coaches: string | null;
		selectedCoach: string | null;
		selectedCoachDetailed: string | null;
		timeSlots: string | null;
		feedback: string | null;
	};
}
