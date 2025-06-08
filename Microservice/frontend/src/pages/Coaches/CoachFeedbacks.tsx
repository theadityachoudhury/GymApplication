import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { getCoachesState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCoachFeedback } from '@/store/slices/coachSlice';
import { SortByValues } from '@/types/coaches/coachesService.interface';
import FeedbackCard from '@/components/common/feedback/FeedbackCard';

interface FeedbackSectionProps {
	coachId: string;
}

const CoachFeedbacks: React.FC<FeedbackSectionProps> = ({
	coachId
}) => {
	const [sortBy, setSortBy] = useState<'Rating' | 'Date'>('Rating');
	const [showSortOptions, setShowSortOptions] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const feedbacksPerPage = 6; // 6 cards per page
	const dispatch = useAppDispatch();
	const { feedback } = useAppSelector(getCoachesState);

	useEffect(() => {
		const sortValue =
			sortBy === 'Rating'
				? SortByValues.RATING_DESC
				: SortByValues.DATE_ASC;

		dispatch(
			fetchCoachFeedback({
				id: coachId,
				pageNumber: currentPage,
				pageSize: feedbacksPerPage,
				sortBy: sortValue,
			})
		).unwrap();
	}, [coachId, currentPage, dispatch, sortBy]);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-semibold uppercase">Feedback</h2>

				<div className="relative">
					<div
						className="flex items-center gap-1 cursor-pointer"
						onClick={() => setShowSortOptions(!showSortOptions)}
					>
						<span className="text-neutral-500 text-sm">
							Sort by
						</span>
						<span className="font-medium text-sm">{sortBy}</span>
						<ChevronDownIcon className="h-4 w-4 text-neutral-700" />
					</div>

					{showSortOptions && (
						<div className="absolute right-0 mt-2 w-32 bg-primary-white border border-neutral-200 rounded-xl shadow-md z-10 overflow-hidden">
							{['Rating', 'Date'].map(option => (
								<div
									key={option}
									className={`px-4 py-2 text-sm cursor-pointer hover:bg-green-100 ${sortBy === option
											? 'font-medium bg-green-50'
											: ''
										}`}
									onClick={() => {
										setSortBy(option as 'Rating' | 'Date');
										setShowSortOptions(false);
									}}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{feedback.items.map(item => (
					<FeedbackCard
						userId={item.userId}
						key={item.id}
						id={item.id}
						userName={item.userName}
						date={item.date}
						rating={item.rating}
						comment={item.comment}
						userImage={item.userImage}
					/>
				))}
			</div>

			{feedback.totalPages > 1 && (
				<div className="flex justify-center mt-8">
					<div className="flex items-center gap-6">
						{currentPage > 3 && (
							<button
								className="text-neutral-500 hover:text-neutral-700 text-sm"
								onClick={() =>
									paginate(
										Math.max(
											Math.floor((currentPage - 1) / 3) *
											3 -
											2,
											1
										)
									)
								}
							>
								«
							</button>
						)}

						{[...Array(Math.min(3, feedback.totalPages))].map(
							(_, i) => {
								const pageNum =
									currentPage <= 3
										? i + 1
										: Math.floor((currentPage - 1) / 3) *
										3 +
										1 +
										i;

								if (pageNum > feedback.totalPages) return null;

								return (
									<button
										key={pageNum}
										onClick={() => paginate(pageNum)}
										className={`relative text-sm font-medium ${currentPage === pageNum
												? 'text-primary-black'
												: 'text-neutral-500 hover:text-neutral-700'
											}`}
									>
										{pageNum}
										{currentPage === pageNum && (
											<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-green"></div>
										)}
									</button>
								);
							}
						)}

						{feedback.totalPages > 3 &&
							currentPage <=
							Math.floor((feedback.totalPages - 1) / 3) *
							3 && (
								<button
									className="text-neutral-500 hover:text-neutral-700 text-sm"
									onClick={() =>
										paginate(
											Math.floor(currentPage / 3) * 3 + 4
										)
									}
								>
									»
								</button>
							)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CoachFeedbacks;
