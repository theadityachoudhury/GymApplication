// import config from "../../config"
import { IWorkoutService } from '../../types/workout/workoutService.interface';
import { ApiWorkoutService } from './apiWorkoutService';

export const getWorkoutService = (): IWorkoutService => {
	// if (config.USE_MOCK_API) {
	// return new MockWorkoutService();
	// } else {
	return new ApiWorkoutService()
	// return;
	// }
};
