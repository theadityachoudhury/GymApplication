import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { getAuthState } from '@/hooks/redux';

const PrivateComponent = () => {
	const isAuthenticated = useSelector(getAuthState).isAuthenticated;
	console.log('isAuthenticated', isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default PrivateComponent;
