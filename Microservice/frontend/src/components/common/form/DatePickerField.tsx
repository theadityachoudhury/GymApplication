import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import CalendarContainer from './Calendar';

interface IntegratedDatePickerProps {
	selectedDate: Date;
	onChange: (date: Date) => void;
	disabledDates?: Date[]; // New prop for disabled dates
}

const IntegratedDatePicker: React.FC<IntegratedDatePickerProps> = ({
	selectedDate,
	onChange,
	disabledDates = [], // Default to empty array if not provided
}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const datePickerRef = useRef<HTMLDivElement>(null);

	// Format date
	const formattedSelectedDate = `${selectedDate.toLocaleString('en-IN', {
		month: 'long',
	})} ${selectedDate.getDate()}`;

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				datePickerRef.current &&
				!datePickerRef.current.contains(event.target as Node)
			) {
				setShowCalendar(false);
				setIsFocused(false);
			}
		};

		if (showCalendar || isFocused) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showCalendar, isFocused]);

	// Listen for selected date via custom event from CalendarContainer
	useEffect(() => {
		const handleCalendarDateChange = (event: Event) => {
			if (event instanceof CustomEvent && event.detail?.date) {
				onChange(new Date(event.detail.date));
				setShowCalendar(false);
				setIsFocused(false);
			}
		};

		window.addEventListener('dateSelected', handleCalendarDateChange);
		return () => {
			window.removeEventListener(
				'dateSelected',
				handleCalendarDateChange
			);
		};
	}, [onChange]);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleClick = () => {
		setShowCalendar(!showCalendar);
		setIsFocused(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			setShowCalendar(!showCalendar);
		}
	};

	return (
		<div className="relative w-full" ref={datePickerRef}>
			<fieldset
				className={`border rounded-md px-1 pt-1 pb-2 relative cursor-pointer ${
					isFocused ? 'border-black' : 'border-gray-200'
				}`}
				onClick={handleClick}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				tabIndex={0}
			>
				<legend className="text-neutral-700 text-xs px-2 font-lexend">
					Date
				</legend>
				<div className="flex justify-between items-center font-lexend pb-1 pr-3">
					<div className="text-md font-normal text-primary-black px-3">
						{formattedSelectedDate}
					</div>
					<ChevronDown
						size={12}
						className={`
              text-gray-500 transition-transform mt-2 duration-300 ease-in-out
              ${showCalendar ? 'rotate-180' : 'rotate-0'}
            `}
					/>
				</div>
			</fieldset>

			{showCalendar && (
				<div className="absolute mt-2 z-10 border rounded-md bg-white shadow-lg">
					<CalendarContainer
						selectedDate={selectedDate}
						onDateSelect={(date: Date) => {
							onChange(date);
							setShowCalendar(false);
							setIsFocused(false);
						}}
						disabledDates={disabledDates} // Pass disabled dates to CalendarContainer
					/>
				</div>
			)}
		</div>
	);
};

export default IntegratedDatePicker;
