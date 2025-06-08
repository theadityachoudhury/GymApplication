'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronUp } from 'lucide-react';

export interface FitnessGoalSelectorProps {
	label: string;
	options: string[];
	defaultValue?: string;
	onChange?: (selected: string) => void;
}

export default function FitnessGoalSelector({
	label,
	options,
	defaultValue,
	onChange,
}: FitnessGoalSelectorProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedGoal, setSelectedGoal] = useState<string>(
		defaultValue || options[0]
	);
	const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

	useEffect(() => {
		if (defaultValue) {
			setSelectedGoal(defaultValue);
		}
	}, [defaultValue]);

	const handleSelect = (goal: string) => {
		setSelectedGoal(goal);
		setIsOpen(false);
		onChange?.(goal);
	};

	return (
		<div className="w-[35%] mx-auto p-4 font-[Lexend] text-[14px] text-black">
			<div className="relative">
				{/* Label */}
				<div className="absolute -top-3 left-5 px-1 bg-white z-10">
					<span style={{ color: '#4B5563', fontSize: '12px' }}>
						{label}
					</span>
				</div>

				{/* Dropdown header */}
				<div
					className="flex justify-between items-center rounded-2xl cursor-pointer mt-3 h-[12vh] px-6"
					style={{
						border: '1px solid #DADADA',
						boxShadow: 'none',
					}}
					onClick={() => setIsOpen(!isOpen)}
				>
					<div className="text-black">{selectedGoal}</div>
					<ChevronUp
						className={`h-6 w-6 text-black transition-transform ${isOpen ? '' : 'rotate-180'}`}
					/>
				</div>

				{/* Dropdown menu */}
				{isOpen && (
					<div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white z-10 shadow-lg overflow-hidden">
						{options.map((goal: string) => (
							<div
								key={goal}
								className="cursor-pointer flex justify-between items-center"
								style={{
									padding: '1.5rem',
									fontSize: '14px',
									fontFamily: 'Lexend',
									color: '#000000',
									backgroundColor:
										hoveredGoal === goal
											? '#F6FFE5'
											: 'transparent',
								}}
								onClick={() => handleSelect(goal)}
								onMouseEnter={() => setHoveredGoal(goal)}
								onMouseLeave={() => setHoveredGoal(null)}
							>
								{goal}
								{selectedGoal === goal && (
									<Check className="h-6 w-6 text-black" />
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
