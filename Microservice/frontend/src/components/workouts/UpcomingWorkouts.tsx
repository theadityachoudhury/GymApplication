import { Clock } from 'lucide-react'; // or use Heroicons if you want

export interface Workout {
	title: string;
	date: string;
	duration: string;
}

interface UpcomingWorkoutsProps {
	workouts: Workout[];
}

export default function UpcomingWorkouts({ workouts }: UpcomingWorkoutsProps) {
	console.log('Upcoming Workouts:', workouts);
	return (
		<div className="w-full mx-auto">
			<h2 className="text-xs uppercase text-gray-500 mb-4">
				Upcoming Workouts
			</h2>
			<div className="space-y-2 text-black">
				{workouts.map((workout, index) => (
					<div
						key={index}
						className="bg-[#F3FAFF] flex items-center justify-between p-4 rounded border-l-8 border-[#A0D8FD]"
					>
						<div className="flex flex-row justify-center items-center gap-4">
							<span className="font-medium text-lg">
								{workout.title}
							</span>
							<span className="text-sm ml-6 font-light">
								{workout.date}
							</span>
						</div>
						<div className="flex items-center gap-1 text-sm font-light">
							<Clock size={16} />
							{workout.duration}
						</div>
					</div>
				))}
			</div>

			{workouts.length === 0 && (
				<div className="bg-[#F3FAFF] p-4 rounded border-l-8 border-[#A0D8FD]">
					No upcoming workouts scheduled.
				</div>
			)}
		</div>
	);
}
