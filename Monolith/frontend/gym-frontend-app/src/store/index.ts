import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coachesReducer from './slices/coachSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		coach: coachesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
