import LoginForm from '@/components/auth/LoginForm';
import { getAuthState, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { StaticImage } from '@/components/common/ui/StaticImage';

const Login = () => {
	const { isAuthenticated } = useAppSelector(getAuthState);
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
				<div className="w-full max-w-md">
					<h2 className="text-uppercase-small-heading mb-2">
						Welcome back
					</h2>
					<h1 className="text-subtitle-large-heading mb-6">
						Log In to Your Account
					</h1>
					<LoginForm />
				</div>
			</div>
			<div className="w-full md:w-1/2 h-screen p-5 hidden md:block">
				<StaticImage />
			</div>
		</div>
	);
};

export default Login;
