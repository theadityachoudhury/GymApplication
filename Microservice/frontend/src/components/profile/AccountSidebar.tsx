import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/ui/CustomButton';
import { getAuthState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { Role } from '@/types/auth/user.enum';

const AccountSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const { userDetail } = useAppSelector(getAuthState);

	const isActive = (path: string) =>
		location.pathname === path ||
		(location.pathname === '/profile' && path === '/profile');

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};

	return (
		<div className="flex flex-col justify-between bg-white w-full">
			<div className="flex md:flex-col flex-row justify-around items-left w-full">
				<div
					className={`w-full py-4 px-6 cursor-pointer ${isActive('/profile')
							? 'border-l-4 border-l-lime-500 bg-gray-100'
							: 'hover:bg-gray-100'
						}`}
					onClick={() => navigate('/profile')}
				>
					<p className="text-gray-800 font-semibold uppercase text-sm">
						General Information
					</p>
				</div>

				{userDetail?.role.toUpperCase() === Role.COACH && (
					<div
						className={`w-full py-4 px-6 cursor-pointer ${isActive('/profile/feedbacks')
								? 'border-l-4 border-l-lime-500 bg-gray-100'
								: 'hover:bg-gray-100'
							}`}
						onClick={() => navigate('/profile/feedbacks')}
					>
						<p className="text-gray-800 font-semibold uppercase text-sm">
							Client Feedbacks
						</p>
					</div>
				)}

				<div
					className={`w-full py-4 px-6 cursor-pointer ${isActive('/profile/change-password')
							? 'border-l-4 border-l-lime-500 bg-gray-100'
							: 'hover:bg-gray-100'
						}`}
					onClick={() => navigate('/profile/change-password')}
				>
					<p className="text-gray-800 font-semibold uppercase text-sm">
						Change Password
					</p>
				</div>
			</div>

			{/* Logout Button */}
			<div className="px-6 py-4 md:mt-4 w-full flex justify-center">
				<Button
					variant="red"
					className="w-[40%] md:w-auto"
					onClick={handleLogout}
				>
					Logout
				</Button>
			</div>
		</div>
	);
};

export default AccountSidebar;