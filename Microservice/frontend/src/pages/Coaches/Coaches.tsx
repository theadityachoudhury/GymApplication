import CoachCard from '@/components/coaches/CoachCard';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import { getCoachesState, useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCoaches } from '@/store/slices/coachSlice';
import { coachesType } from '@/types/coaches/coaches.type';
import { useEffect, useState, useTransition } from 'react';

function Coaches() {
	const dispatch = useAppDispatch();
	const { coaches: coachList } = useAppSelector(getCoachesState);
	const [coaches, setCoaches] = useState<coachesType[] | null>(null);
	const [isPending, startTransition] = useTransition();

	async function fetchAllCoaches() {
		const response = await dispatch(fetchCoaches()).unwrap();
		if (response) {
			setCoaches(response.data);
		}
	}

	useEffect(() => {
		console.log(coachList);
		startTransition(async () => {
			await fetchAllCoaches();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isPending) return <LoadingSpinner />;

	return (
		<>
			{coaches && coaches.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5 max-w-7xl mx-auto place-items-center">
					{coaches.map(coach => (
						<CoachCard key={coach.id} coach={coach} />
					))}
				</div>
			)}
		</>
	);
}

export default Coaches;
