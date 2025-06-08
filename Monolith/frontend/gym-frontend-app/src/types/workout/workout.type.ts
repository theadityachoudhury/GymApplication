import { Specialization } from '../coaches/coaches.type';
 
export type availableWorkoutsType = {
    id: string;
    name: string;
    description: string;
    activity: Specialization;
    coachId: string;
    dateTime: string;
    state: string;
    image: string;
};
 
export enum WorkoutState {
    scheduled = 'scheduled',
    waiting_for_feedback = 'waiting_for_feedback',
    completed = 'completed',
    cancelled = 'cancelled',
}
 
export interface Workout {
    id: string;
    clientId: string;
    coachId: string;
    name: string;
    description: string;
    activity: Specialization;
    dateTime: string;
    state: WorkoutState;
}
interface TimeSlotInfo {
    startTime: string;
    endTime: string;
    timeSlotId: string;
}
 
 
export interface CoachWorkoutAvailability {
    coachId: string;
    firstName: string;
    lastName: string;
    role: string;
    image: string;
    title: string;
    about: string;
    rating: number;
    workoutId: string;
    activityId: string;
    workoutName: string;
    timeSlotId: string | null;
    timeSlot: string | null;
    date: Date;
    alternativeTimeSlots: TimeSlotInfo[];
}
 