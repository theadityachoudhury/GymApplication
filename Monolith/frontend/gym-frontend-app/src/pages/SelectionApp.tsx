import FitnessGoalSelector from '../components/common/form/Selection';

export default function SelectionApp() {
	return (
		<main className="flex min-h-screen items-center justify-center p-24">
			<FitnessGoalSelector
				label="Your target"
				options={[
					'Lose weight',
					'Gain weight',
					'Improve flexibility',
					'General fitness',
					'Build Muscle',
					'Rehabilitation/Recovery',
				]}
				defaultValue="Gain weight"
				onChange={val => console.log('Selected:', val)}
			/>
		</main>
	);
}
