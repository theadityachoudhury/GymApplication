/* eslint-disable @typescript-eslint/no-explicit-any */

import { Star } from 'lucide-react';
import Button from '../common/ui/CustomButton';
import PdfIcon from '@/assets/icons/pdf-icon.svg';
import { coachDetailedType } from '@/types/coaches/coaches.type';
import { ConfirmBookingDialog } from '../modals/ConfirmBookingPopUp';
import { ReactNode } from 'react';
import { getAuthState, useAppSelector } from '@/hooks/redux';
import { CustomAlertDialog } from '../modals/ConfirmationPopUp';
import { useNavigate } from 'react-router';

interface CoachProfileCardProps extends coachDetailedType {
	sessionType?: string;
	mainSessionDate?: ReactNode;
	sessionDuration?: string;
	onBookWorkout: (date: string, specialization: string) => void;
}

export default function CoachProfileCard({
	name,
	image,
	title,
	rating,
	about,
	specializations,
	certificates,
	mainSessionDate,
	sessionDuration,
	onBookWorkout,
}: CoachProfileCardProps) {
	const { isAuthenticated, userDetail: user } = useAppSelector(getAuthState);
	const navigate = useNavigate();

	return (
		<div className="mx-auto w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
			<div className="relative w-full aspect-[5/6]">
				<img
					src={image || '/placeholder.svg'}
					alt={`${name} profile`}
					className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
				/>
			</div>
			{/* Overlay for gradient effect */}
			<div className="flex flex-col p-6 gap-4 text-gray-700">
				{/* Name and Rating */}
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">{name}</h2>
					<div className="flex items-center gap-1 text-sm">
						<span>{rating.toFixed(2)}</span>
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
					</div>
				</div>

				{/* Title */}
				<p className="text-sm font-light -mt-4 text-gray-500">
					{title}
				</p>

				{/* About Section */}
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">About coach</h3>
					<p className="text-sm leading-relaxed font-light text-gray-500">
						{about}
					</p>
				</div>

				{/* Specialization */}
				{specializations.length > 0 && (
					<div className="space-y-2">
						<h3 className="text-sm font-semibold">
							Specialization
						</h3>
						<div className="flex flex-wrap gap-2 -ml-1">
							{specializations.map(
								(specialization: any, index) => (
									<span
										key={index}
										className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-700 rounded-sm"
									>
										{specialization.name}
									</span>
								)
							)}
						</div>
					</div>
				)}

				{/* Certificates */}
				{certificates.length > 0 && (
					<div className="space-y-2">
						<h3 className="text-sm font-semibold">Certificates</h3>
						<div className="flex flex-col gap-2">
							{certificates.map((certificate, index) => {
								const url = `/assets/certificates/${certificate.url}`;
								return (
									<a
										key={index}
										href={url}
										download
										className="flex items-center gap-2 text-xs font-semibold text-gray-700 underline"
									>
										<img
											src={PdfIcon}
											alt="Certificate Icon"
										/>

										{certificate.name}
									</a>
								);
							})}
						</div>
					</div>
				)}

				{/* Buttons */}

				{user?.role.toUpperCase() !== 'ADMIN' && (
					<>
						{isAuthenticated ? (
							<ConfirmBookingDialog
								trigger={
									<Button disabled={specializations.length === 0} fullWidth className="text-sm">
										Book Workout
									</Button>
								}
								onConfirm={() => {
									console.log("booking workout");
									if (!specializations.length) return;
									onBookWorkout(mainSessionDate as string, (specializations as any)[0].id)
								}}
							>
								<div className="flex flex-col xl:flex-row gap-6">
									{/* Coach Info */}
									<div className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-1">
										<div>
											<img
												src={image}
												alt={`${name}`}
												className="rounded-full w-32 h-32 object-cover"
											/>
										</div>

										<div className="flex flex-col items-center text-center md:text-left lg:space-y-5 md:items-start">
											<div>
												<h2 className="text-2xl font-semibold text-neutral-700">
													{name}
												</h2>
												<p className="text-neutral-700">
													{title}
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
														{
															specializations.length > 0 ? (specializations as any)[0]
																.name : "N/A"
														}
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
						) : (
							<CustomAlertDialog
								title="Log in to book workout"
								description="You must be logged in to book a workout. Please log in to access available slots and book your session."
								trigger={
									<Button disabled={specializations.length === 0} variant="primary" fullWidth>
										Book Workout
									</Button>
								}
								onConfirm={() => navigate('/login')}
								onCancel={() => { }}
								confirmText="Log In"
								cancelText="Cancel"

							/>
						)}

						<div className="flex flex-col gap-2">
							{/* <Button fullWidth onClick={() => { }}>
            Book Workout
          </Button> */}
							{isAuthenticated && (<Button
								fullWidth
								variant="outline"
								className="text-sm"
								onClick={() => { }}
							>
								Repeat Previous Workout
							</Button>)}
						</div>
					</>
				)}


			</div>
		</div>
	);
}
