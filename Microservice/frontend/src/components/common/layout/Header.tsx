import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import WelcomeStrip from './WelcomeStrip';
import EnergyX from '@/assets/EnergyX.svg';
import profile from '@/assets/profile.svg';
import notification from '@/assets/notifications.svg';
import accountIcon from '@/assets/icons/settings-icon.svg';
import { Menu, X } from 'lucide-react';
import { getAuthState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import Button from '@/components/common/ui/CustomButton';
import { Role } from '@/types/auth/user.enum';

const Header: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);

	const { isAuthenticated,userDetail:user } = useAppSelector(getAuthState);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const fullName = `${user?.firstName} ${user?.lastName}`.trim() || 'Guest';
	const userEmail = user?.email || 'guest@nomail.com';

	const handleProfileClick = () => {
		setIsDropdownOpen(prev => !prev);
		if (isMobileMenuOpen) setIsMobileMenuOpen(false);
	};

	const handleLogout = () => {
		dispatch(logout());
		setIsDropdownOpen(false);
		// navigate('/');
	};

	const handleAccountClick = () => {
		navigate('/profile');
		setIsDropdownOpen(false);
	};

	const getLinkClass = ({ isActive }: { isActive: boolean }) =>
		`inline-block pb-1 border-b-2 ${
			isActive ? 'border-primary-green' : 'border-transparent'
		} hover:border-primary-green transition-colors`;

	const hiddenWelcomeStripRoutes: string[] = ['/coaches'];
	const showWelcomeStrip =
		hiddenWelcomeStripRoutes.includes(location.pathname) ||
		location.pathname.split('/')[1] === 'coaches'
			? false
			: true;

	const getWelcomeMessage = () => {
		if (
			location.pathname === '/profile' ||
			location.pathname === '/profile/change-password' ||
			location.pathname === '/profile/feedbacks'
		)
			return 'My Account';
		if (location.pathname === '/workouts') return 'My Workouts';
		return isAuthenticated ? `Hello, ${fullName}!` : 'Welcome!';
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest(
					'button[aria-label="Toggle Menu"]'
				)
			) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 h-[72px] relative">
				<div className="flex items-center">
					<Link to="/">
						<div className="flex items-center mr-4">
							<img
								src={EnergyX}
								alt="EnergyX Logo"
								className="h-8 w-8"
							/>
							<span className="ml-2 text-xl font-semibold">
								EnergyX
							</span>
						</div>
					</Link>

					<nav className="hidden md:flex space-x-8 mt-1 ml-6">
						{(!isAuthenticated ||
							user?.role === Role.CLIENT ||
							user?.role === Role.ADMIN) && (
							<NavLink to="/" className={getLinkClass}>
								Home
							</NavLink>
						)}

						{isAuthenticated && (
							<>
								{(user?.role === Role.CLIENT ||
									user?.role === Role.COACH) && (
									<NavLink
										to="/workouts"
										className={getLinkClass}
									>
										Workouts
									</NavLink>
								)}
								{user?.role === Role.CLIENT && (
									<NavLink
										to="/coaches"
										className={getLinkClass}
									>
										Coaches
									</NavLink>
								)}
								{user?.role === Role.ADMIN && (
									<NavLink
										to="/reports"
										className={getLinkClass}
									>
										Reports
									</NavLink>
								)}
							</>
						)}

						{!isAuthenticated && (
							<NavLink to="/coaches" className={getLinkClass}>
								Coaches
							</NavLink>
						)}
					</nav>
				</div>

				<div className="h-10 flex items-center space-x-4">
					{isAuthenticated ? (
						<>
							<button
								aria-label="Notifications"
								className="-mt-1 cursor-pointer"
							>
								<img
									src={notification}
									alt="Notifications"
									className="h-6 w-6"
								/>
							</button>
							<div className="relative">
								<button onClick={handleProfileClick}>
									<img
										src={profile}
										alt="Profile"
										className="h-6 w-6 cursor-pointer"
									/>
								</button>

								{isDropdownOpen && (
									<div
										ref={dropdownRef}
										className="absolute right-0 top-10 w-56 p-4 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
									>
										<div className="text-center mb-4">
											<div className="font-semibold">
												{fullName} ({user?.role})
											</div>
											<div className="text-sm text-neutral-500">
												{userEmail}
											</div>
										</div>
										<hr className="my-2" />
										<div
											className="flex items-center gap-2 py-2 hover:bg-neutral-100 rounded-md cursor-pointer px-2"
											onClick={handleAccountClick}
										>
											<img
												src={accountIcon}
												alt="Account"
												className="w-4 h-4"
											/>
											<div>
												<div className="text-sm font-medium">
													My Account
												</div>
												<div className="text-xs text-neutral-500">
													Edit account profile
												</div>
											</div>
										</div>
										<Button
											onClick={handleLogout}
											variant="red"
											className="w-full mt-4 text-center"
										>
											Log Out
										</Button>
									</div>
								)}
							</div>
						</>
					) : (
						<Button
							variant="outline"
							size="medium"
							onClick={() => navigate('/login')}
						>
							Log In
						</Button>
					)}

					<Button
						className="md:hidden text-black bg-white hover:bg-white"
						onClick={() => setIsMobileMenuOpen(prev => !prev)}
						aria-label="Toggle Menu"
						variant="text"
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6 -mt-1" />
						) : (
							<Menu className="h-6 w-6 -mt-1" />
						)}
					</Button>
				</div>

				<div
  ref={mobileMenuRef}
  className={`absolute top-[72px] left-0 w-full bg-white border-t border-neutral-200 md:hidden z-40 shadow-md transform transition-all duration-300 ease-in-out ${
    isMobileMenuOpen
      ? 'opacity-100 translate-y-0 max-h-96'
      : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
  }`}
>
  <div className="p-6 flex flex-col space-y-4">
    {/* Common link for all authenticated users and non-authenticated users */}
    <NavLink
      to="/"
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `self-start inline-block border-b-2 ${
          isActive ? 'border-primary-green' : 'border-transparent'
        } hover:border-primary-green transition-colors`
      }
    >
      Home
    </NavLink>

    {/* Client and Coach specific links */}
    {isAuthenticated && 
      (user?.role.toUpperCase() === Role.CLIENT || 
       user?.role.toUpperCase() === Role.COACH) && (
      <NavLink
        to="/workouts"
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `self-start inline-block border-b-2 ${
            isActive ? 'border-primary-green' : 'border-transparent'
          } hover:border-primary-green transition-colors`
        }
      >
        Workouts
      </NavLink>
    )}

    {/* Client specific links */}
    {isAuthenticated && user?.role.toUpperCase() === Role.CLIENT && (
      <NavLink
        to="/coaches"
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `self-start inline-block border-b-2 ${
            isActive ? 'border-primary-green' : 'border-transparent'
          } hover:border-primary-green transition-colors`
        }
      >
        Coaches
      </NavLink>
    )}

    {/* Admin specific links */}
    {isAuthenticated && user?.role.toUpperCase() === Role.ADMIN && (
      <NavLink
        to="/reports"
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `self-start inline-block border-b-2 ${
            isActive ? 'border-primary-green' : 'border-transparent'
          } hover:border-primary-green transition-colors`
        }
      >
        Reports
      </NavLink>
    )}

    {/* Login button for non-authenticated users */}
    {!isAuthenticated && (
      <Button
        variant="outline"
        onClick={() => {
          navigate('/login');
          setIsMobileMenuOpen(false);
        }}
        className="text-left px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
      >
        Log In
      </Button>
    )}
  </div>
</div>
			</header>

			{showWelcomeStrip && (
				<WelcomeStrip customMessage={getWelcomeMessage()} />
			)}
		</>
	);
};

export default Header;
