import { coachesType } from '@/types/coaches/coaches.type';
import Button from '../common/ui/CustomButton';
import { useNavigate } from 'react-router';

function CoachCard({ coach }: { coach: coachesType }) {
	const {
		name,
		summary: title,
		motivationPitch: description,
		rating,
		imageUrl: image,
	} = coach;
	const navigator = useNavigate();
	return (
		<div className="flex flex-col rounded-2xl h-full bg-white shadow-lg overflow-hidden flex-1 min-w-[250px] max-w-[300px]">
			{/* Image */}
			<div className="w-full aspect-[4/3]">
				<img
					src={image || '/placeholder.svg'}
					alt={`${name}`}
					className="w-full h-full object-cover object-center"
				/>
			</div>

			{/* Content */}
			<div className="p-5 flex flex-col flex-1 justify-between">
				<div className="flex justify-between items-start mb-1">
					<h2 className="text-lg font-semibold text-gray-800">
						{name}
					</h2>
					<div className="flex items-center gap-1">
						<span className="text-sm font-semibold text-gray-700">
							{rating.toFixed(2)}
						</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							className="text-yellow-400"
						>
							<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
						</svg>
					</div>
				</div>

				<h3 className="text-sm text-gray-500 mb-3">{title}</h3>

				<p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-3">
					{description}
				</p>

				<Button onClick={() => navigator(`/coaches/${coach.id}`)}>
					Book Workout
				</Button>
			</div>
		</div>
	);
}

export default CoachCard;
