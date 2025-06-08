import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useSelector } from 'react-redux';
import { AuthState } from '../types/auth/auth.type';
import { CoachesState } from '@/types/coaches/coaches.type';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const getAuthState = (state: RootState): AuthState => state.auth;
export const getCoachesState = (state: RootState): CoachesState => state.coach;
