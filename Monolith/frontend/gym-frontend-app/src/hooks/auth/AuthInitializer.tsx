import { useEffect } from 'react';
import { getAuthState, useAppDispatch, useAppSelector } from '../redux';
import { getUserProfile } from '@/store/slices/authSlice';

export const AuthInitializer = () => {
	const dispatch = useAppDispatch();
	const { token, userDetail, isLoading } = useAppSelector(getAuthState);

	useEffect(() => {
		console.log({ token, userDetail });
		if (token && !userDetail && !isLoading) {
			dispatch(getUserProfile());
		}
	}, [token, userDetail, isLoading, dispatch]);

	return null;
};
