import { Route, Routes, useLocation } from 'react-router';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import Header from './components/common/layout/Header';
import PrivateComponent from './components/auth/PrivateComponent';
import { AuthInitializer } from './hooks/auth/AuthInitializer';
import { getAuthState, useAppSelector } from './hooks/redux';
import LoadingSpinner from './components/common/ui/LoadingSpinner';
import MyWorkouts from './pages/Workouts/MyWorkouts';
import Coaches from './pages/Coaches/Coaches';
import CoachBooking from './pages/Coaches/CoachBooking';
import MyAccount from './pages/Profile/MyAccount';
import GeneralInformation from './components/profile/GeneralInformation';
import ChangePassword from './components/profile/ChangePassword';
import CoachFeedbacks from './pages/Coaches/CoachFeedbacks';
import AuthEventListener from './helpers/auth/authEventListners';
import Reports from './pages/Admin/Reports';

function App() {
	const location = useLocation();
	const hideHeaderRoutes = ['/login', '/register'];
	const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

	const { initialAuthCheckComplete, isLoading } =
		useAppSelector(getAuthState);

	if (!initialAuthCheckComplete && isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<>
			<AuthEventListener />
			<AuthInitializer />

			{!shouldHideHeader && <Header />}

			<Routes>
				{/* Auth Routes */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Private Routes */}
				<Route element={<PrivateComponent />}>
					{/* You can add private routes here */}
					<Route path="/workouts" element={<MyWorkouts />} />
					<Route path="/profile" element={<MyAccount />}>
						<Route index element={<GeneralInformation />} />
						<Route path="feedbacks" element={<CoachFeedbacks />} />
						<Route
							path="change-password"
							element={<ChangePassword />}
						/>
					</Route>
					<Route path='/reports' element={<Reports />}></Route>
				</Route>

				{/* Public Routes */}
				<Route path="/" element={<Home />} />
				<Route path="/coaches" element={<Coaches />} />
				<Route path="/coaches/:coachId" element={<CoachBooking />} />
			</Routes>
		</>
	);
}

export default App;
