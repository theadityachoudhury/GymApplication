// src/types/feedback/feedbacks.type.ts
export interface feedbackType {
	id: string;
	userId: string;
	userName: string;
	userImage?: string;
	rating: string;
	comment: string;
	date: string;
	emptyFeedback?: boolean; // Flag to indicate if feedback is empty
}
