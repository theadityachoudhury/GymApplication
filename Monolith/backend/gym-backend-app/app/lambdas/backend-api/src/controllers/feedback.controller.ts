import { FeedbackService } from "@/services/feedback.service";
import { Types } from "mongoose";

export class FeedbackController {
    private feedbackService: FeedbackService;

    constructor() {
        this.feedbackService = new FeedbackService();
    }

    async addFeedback({ userId, bookingId, message, rating }: { userId: Types.ObjectId, bookingId: Types.ObjectId, message: string, rating: number }) {
        return await this.feedbackService.addFeedback({ userId, bookingId, message, rating });
    }

    async getFeedbackForCoach(userId: Types.ObjectId, perPage: number, page: number,sortBy: string) {
        return await this.feedbackService.getFeedbackForUserCoach(userId, perPage, page,sortBy);
    }
}