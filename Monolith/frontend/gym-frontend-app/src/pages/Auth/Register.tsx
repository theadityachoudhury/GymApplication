import { useEffect } from 'react';

import RegisterForm from '@/components/auth/RegisterForm';
import { getAuthState, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router';
import { StaticImage } from '@/components/common/ui/StaticImage';

const Register = () => {
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
						LET'S GET YOU STARTED!
					</h2>
					<h1 className="text-subtitle-large-heading mb-6">
						Create an Account
					</h1>
					<RegisterForm />
				</div>
			</div>
			<div className="w-full md:w-1/2 h-screen p-5 hidden md:block">
				<StaticImage />
			</div>
		</div>
	);
};

export default Register;
