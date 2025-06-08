import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoachesState } from '../../types/coaches/coaches.type';
import { SortByValues } from '../../types/coaches/coachesService.interface';
import { getCoachesService } from '@/services/Coaches/coachesServiceFactory';

// Create an instance of the service
const coachesService = getCoachesService();

// Initial state
const initialState: CoachesState = {
	coaches: [],
	selectedCoach: null,
	selectedCoachDetailed: null,
	availableTimeSlots: [],
	feedback: {
		items: [],
		currentPage: 1,
		totalPages: 0,
		totalElements: 0,
		sortBy: SortByValues.DATE_DESC,
		pageSize: 5,
	},
	loading: {
		coaches: false,
		selectedCoach: false,
		selectedCoachDetailed: false,
		timeSlots: false,
		feedback: false,
	},
	error: {
		coaches: null,
		selectedCoach: null,
		selectedCoachDetailed: null,
		timeSlots: null,
		feedback: null,
	},
};

// Async thunks
export const fetchCoaches = createAsyncThunk(
	'coaches/fetchCoaches',
	async (_, { rejectWithValue }) => {
		try {
			const response = await coachesService.getCoaches();
			if (response.status !== 200) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error) {
			console.log(error);

			return rejectWithValue('Failed to fetch coaches');
		}
	}
);

export const fetchCoachById = createAsyncThunk(
	'coaches/fetchCoachById',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await coachesService.getCoachById(id);
			if (response.status !== 200) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error) {
			console.log(error);

			return rejectWithValue('Failed to fetch coach details');
		}
	}
);

// New thunk for fetching detailed coach information
export const fetchCoachDetailedById = createAsyncThunk(
	'coaches/fetchCoachDetailedById',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await coachesService.getCoachDetailedById(id);
			if (response.status !== 200) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error) {
			console.log(error);

			return rejectWithValue(
				'Failed to fetch detailed coach information'
			);
		}
	}
);

export const fetchCoachTimeSlots = createAsyncThunk(
	'coaches/fetchCoachTimeSlots',
	async ({ id, date }: { id: string; date: string }, { rejectWithValue }) => {
		try {
			const response = await coachesService.getCoachTimeSlots(id, date);

			console.log(response);

			if (response.status !== 200) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error) {
			console.log(error);

			return rejectWithValue('Failed to fetch time slots');
		}
	}
);

export const fetchCoachFeedback = createAsyncThunk(
	'coaches/fetchCoachFeedback',
	async (
		{
			id,
			pageNumber,
			pageSize,
			sortBy,
		}: {
			id: string;
			pageNumber: number;
			pageSize: number;
			sortBy: SortByValues;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await coachesService.getCoachFeedback({
				id,
				pageNumber,
				pageSize,
				sortBy,
			});
			if (response.status !== 200) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error) {
			console.log(error);

			return rejectWithValue('Failed to fetch feedback');
		}
	}
);

// Create the slice
const coachesSlice = createSlice({
	name: 'coaches',
	initialState,
	reducers: {
		setFeedbackSortBy: (state, action: PayloadAction<SortByValues>) => {
			state.feedback.sortBy = action.payload;
		},
		setFeedbackPageSize: (state, action: PayloadAction<number>) => {
			state.feedback.pageSize = action.payload;
		},
		resetSelectedCoach: state => {
			state.selectedCoach = null;
			state.selectedCoachDetailed = null;
			state.availableTimeSlots = [];
			state.feedback.items = [];
			state.feedback.currentPage = 1;
			state.feedback.totalPages = 0;
			state.feedback.totalElements = 0;
		},
	},
	extraReducers: builder => {
		// Handle fetchCoaches
		builder.addCase(fetchCoaches.pending, state => {
			state.loading.coaches = true;
			state.error.coaches = null;
		});
		builder.addCase(fetchCoaches.fulfilled, (state, action) => {
			state.coaches = action.payload.data;
			state.loading.coaches = false;
		});
		builder.addCase(fetchCoaches.rejected, (state, action) => {
			state.loading.coaches = false;
			state.error.coaches = action.payload as string;
		});

		// Handle fetchCoachById
		builder.addCase(fetchCoachById.pending, state => {
			state.loading.selectedCoach = true;
			state.error.selectedCoach = null;
		});
		builder.addCase(fetchCoachById.fulfilled, (state, action) => {
			state.selectedCoach = action.payload.data[0] || null;
			state.loading.selectedCoach = false;
		});
		builder.addCase(fetchCoachById.rejected, (state, action) => {
			state.loading.selectedCoach = false;
			state.error.selectedCoach = action.payload as string;
		});

		// Handle fetchCoachDetailedById
		builder.addCase(fetchCoachDetailedById.pending, state => {
			state.loading.selectedCoachDetailed = true;
			state.error.selectedCoachDetailed = null;
		});
		builder.addCase(fetchCoachDetailedById.fulfilled, (state, action) => {
			state.selectedCoachDetailed = action.payload.data[0] || null;
			state.loading.selectedCoachDetailed = false;
		});
		builder.addCase(fetchCoachDetailedById.rejected, (state, action) => {
			state.loading.selectedCoachDetailed = false;
			state.error.selectedCoachDetailed = action.payload as string;
		});

		// Handle fetchCoachTimeSlots
		builder.addCase(fetchCoachTimeSlots.pending, state => {
			state.loading.timeSlots = true;
			state.error.timeSlots = null;
		});
		builder.addCase(fetchCoachTimeSlots.fulfilled, (state, action) => {
			state.availableTimeSlots = action.payload.data as string[];
			state.loading.timeSlots = false;
		});
		builder.addCase(fetchCoachTimeSlots.rejected, (state, action) => {
			state.loading.timeSlots = false;
			state.error.timeSlots = action.payload as string;
		});

		// Handle fetchCoachFeedback
		builder.addCase(fetchCoachFeedback.pending, state => {
			state.loading.feedback = true;
			state.error.feedback = null;
		});
		builder.addCase(fetchCoachFeedback.fulfilled, (state, action) => {
			state.feedback.items = action.payload.data;
			state.feedback.currentPage = action.payload.currentPage || 1;
			state.feedback.totalPages = action.payload.totalPages || 0;
			state.feedback.totalElements = action.payload.totalElements || 0;
			state.loading.feedback = false;
		});
		builder.addCase(fetchCoachFeedback.rejected, (state, action) => {
			state.loading.feedback = false;
			state.error.feedback = action.payload as string;
		});
	},
});

// Export actions and reducer
export const { setFeedbackSortBy, setFeedbackPageSize, resetSelectedCoach } =
	coachesSlice.actions;
export default coachesSlice.reducer;
