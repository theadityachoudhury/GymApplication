// FeedbackCard.tsx
import { feedbackType } from '@/types/feedback/feedbacks.type';
import { StarIcon } from 'lucide-react';
import React from 'react';

const FeedbackCard: React.FC<feedbackType> = ({
	userImage: avatarUrl,
	userName: name,
	userId: id,
	comment: review,
	date,
	rating,
}) => {
	return (
		<div
			key={id}
			className="bg-primary-white rounded-xl p-6 shadow-md h-full w-full"
		>
			<div className="flex items-center flex-wrap mb-4">
				<img
					src={avatarUrl}
					alt={`${name}'s avatar`}
					className="w-12 h-12 rounded-full object-cover mr-4"
				/>
				<div>
					<h3 className="font-semibold">{name}</h3>
					<p className="text-neutral-500 font-medium text-xs">
						{date}
					</p>
				</div>
				<div className="ml-auto flex">
					{[...Array(5)].map((_, i) => (
						<StarIcon
							key={i}
							className={`h-4 w-4 ${i < Number(rating) ? 'text-semantic-yellow fill-semantic-yellow' : 'text-neutral-200'}`}
						/>
					))}
				</div>
			</div>
			<p className="text-neutral-700 text-sm leading-relaxed mb-2">
				{review}
			</p>
		</div>
	);
};

export default FeedbackCard;
