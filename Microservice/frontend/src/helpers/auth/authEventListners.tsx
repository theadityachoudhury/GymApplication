// src/components/AuthEventListener.tsx

import { useEffect } from 'react';
import { logout } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/redux';

/**
 * Component that listens for global auth events
 */
const AuthEventListener: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const handleLogout = () => {
			dispatch(logout());
		};

		// Listen for the custom logout event
		window.addEventListener('auth:logout', handleLogout);

		// Cleanup
		return () => {
			window.removeEventListener('auth:logout', handleLogout);
		};
	}, [dispatch]);

	// This component doesn't render anything
	return null;
};

export default AuthEventListener;
