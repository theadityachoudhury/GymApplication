import AccountSidebar from '@/components/profile/AccountSidebar';
import { Outlet, useLocation } from 'react-router';

function MyAccount() {
	const location = useLocation();

	return (
		<div className="p-10 w-full flex flex-col md:flex-row">
			<div className="mx-auto md:mx-0">
				<AccountSidebar />
			</div>
			<div
				className={`flex-1 w-full md:ml-10 ${location.pathname === '/profile/feedbacks' ? 'w-full' : 'max-w-[40rem]'}`}
			>
				<Outlet />
			</div>
		</div>
	);
}

export default MyAccount;
