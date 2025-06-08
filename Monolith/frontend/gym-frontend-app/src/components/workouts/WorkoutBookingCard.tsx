import React from 'react';
import Button from '@/components/common/ui/CustomButton';
import { getAuthState, useAppSelector } from '@/hooks/redux';
import { useNavigate } from 'react-router';
import { CustomAlertDialog } from '../modals/ConfirmationPopUp';
import { ConfirmBookingDialog } from '../modals/ConfirmBookingPopUp'; // ✅ Added import

interface WorkoutBookingCardProps {
	coachName: string;
	coachTitle: string;
	rating: number;
	description: string;
	sessionType: string;
	sessionDuration: string;
	mainSessionDate: string;
	alternativeSlots: string[];
	onProfileClick: () => void;
	onBookClick: () => void;
	image: string;
}

const WorkoutBookingCard: React.FC<WorkoutBookingCardProps> = ({
	coachName,
	coachTitle,
	rating,
	description,
	sessionType,
	sessionDuration,
	mainSessionDate,
	alternativeSlots,
	onProfileClick,
	onBookClick,
	image,
}) => {
	const { isAuthenticated, userDetail: user } = useAppSelector(getAuthState);
	const navigate = useNavigate();

	return (
		<div className="flex flex-col justify-around rounded-xl shadow-md p-6 w-full mx-auto text-neutral-700">
			<div className="flex flex-col xl:flex-row gap-2">
				{/* Coach Info */}
				<div className="flex flex-col md:flex-row items-center md:items-start gap-2 flex-1">
					<div>
						<img
							src={image ? image : "placeholder.png"}
							alt={`${coachName}`}
							className="rounded-full w-28 h-28 object-cover"
						/>
					</div>

					<div className="flex flex-col items-center text-center md:text-left lg:space-y-5 md:items-start">
						<div>
							<h2 className="text-md font-semibold text-neutral-700">
								{coachName}
							</h2>
							<p className="text-neutral-700">{coachTitle}</p>
						</div>

						<div className="flex items-center mt-1">
							<span className="font-medium mr-1 text-neutral-700">
								{rating}
							</span>
							<svg
								className="w-4 h-4 text-yellow-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
					</div>
				</div>

				{/* Booking Info */}
				<div className="mt-4 md:mt-0">
					<fieldset className="border border-primary-green rounded-lg p-3">
						<legend className="px-2 text-xs">
							Booking details
						</legend>

						<div className="space-y-3">
							<div className="flex items-start">
								<div className="text-gray-400 mr-2">
									<svg
										className="w-4 h-4 mt-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
										/>
									</svg>
								</div>
								<div>
									<span className="text-sm">Type:</span>
									<span className="ml-1">{sessionType}</span>
								</div>
							</div>

							<div className="flex items-start">
								<div className="text-gray-400 mr-2">
									<svg
										className="w-4 h-4 mt-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<span className="text-sm">Time:</span>
									<span className="ml-1">
										{sessionDuration}
									</span>
								</div>
							</div>

							<div className="flex items-start">
								<div className="text-gray-400 mr-2">
									<svg
										className="w-4 h-4 mt-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<span className="text-sm">Date:</span>
									<span className="ml-1">
										{mainSessionDate}
									</span>
								</div>
							</div>
						</div>
					</fieldset>
				</div>
			</div>

			{/* Description */}
			<p className="text-gray-600 mt-4">{description}</p>

			{/* Alternative Slots */}
			<div className="mt-4">
				<p className="mb-2">Also available for this date:</p>
				<div className="flex flex-wrap gap-2">
					{alternativeSlots.map((slot, index) => (
						<span
							key={index}
							className="bg-green-50 px-3 py-1 rounded-md text-sm"
						>
							{slot}
						</span>
					))}
					{alternativeSlots.length === 0 && (
						<span className="text-gray-500 text-sm">
							No alternative slots available
						</span>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ">
				<Button variant="outline" className={`${isAuthenticated && user?.role==="ADMIN" && "col-span-2"}`} onClick={onProfileClick}>
					Coach Profile
				</Button>

				{isAuthenticated && user?.role.toUpperCase() !== 'ADMIN' ? (
					<ConfirmBookingDialog
						trigger={
							<Button variant="primary" fullWidth>
								Book Workout
							</Button>
						}
						onConfirm={onBookClick}
						onCancel={() => { }}
					>
						<div className="flex flex-col xl:flex-row gap-6">
							{/* Coach Info */}
							<div className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-1">
								<div>
									<img
										src={image}
										alt={`${coachName}`}
										className="rounded-full w-32 h-32 object-cover"
									/>
								</div>

								<div className="flex flex-col items-center text-center md:text-left lg:space-y-5 md:items-start">
									<div>
										<h2 className="text-2xl font-semibold text-neutral-700">
											{coachName}
										</h2>
										<p className="text-neutral-700">
											{coachTitle}
										</p>
									</div>

									<div className="flex items-center mt-1">
										<span className="text-xl font-medium mr-1 text-neutral-700">
											{rating}
										</span>
										<svg
											className="w-5 h-5 text-yellow-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
								</div>
							</div>

							{/* Booking Info */}
							<div className="mt-4 md:mt-0">
								<div className="space-y-3">
									<div className="flex items-start">
										<div className="text-gray-400 mr-2">
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium">
												Type:
											</span>
											<span className="ml-1">
												{sessionType}
											</span>
										</div>
									</div>

									<div className="flex items-start">
										<div className="text-gray-400 mr-2">
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium">
												Time:
											</span>
											<span className="ml-1">
												{sessionDuration}
											</span>
										</div>
									</div>

									<div className="flex items-start">
										<div className="text-gray-400 mr-2">
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium">
												Date:
											</span>
											<span className="ml-1">
												{mainSessionDate}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ConfirmBookingDialog>
				) :
					!isAuthenticated && (<CustomAlertDialog
						title="Log in to book workout"
						description="You must be logged in to book a workout. Please log in to access available slots and book your session."
						trigger={
							<Button variant="primary" fullWidth>
								Book Workout
							</Button>
						}
						onConfirm={() => navigate('/login')}
						onCancel={() => { }}
						confirmText="Log In"
						cancelText="Cancel"
					/>)


				}
			</div>
		</div>
	);
};

export default WorkoutBookingCard;
