import React from 'react';
import DatePicker from 'react-datepicker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

// Props from parent
interface CalendarProps {
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
	disabledDates?: Date[]; // Dates that cannot be selected
	bookedDates?: Date[]; // New prop for dates that have been booked
}

const CalendarContainer: React.FC<CalendarProps> = ({
	selectedDate,
	onDateSelect,
	disabledDates = [], // Default to empty array if not provided
	bookedDates = [], // Default to empty array if not provided
}) => {
	const today = new Date();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_currentMonth, setCurrentMonth] = React.useState(
		new Date(today.getFullYear(), today.getMonth())
	);

	// Custom header
	const CustomHeader = ({
		date,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}: {
		date: Date;
		decreaseMonth: () => void;
		increaseMonth: () => void;
		prevMonthButtonDisabled: boolean;
		nextMonthButtonDisabled: boolean;
	}) => (
		<div>
			<div className="flex justify-between items-center p-4 font-lexend w-full">
				<button
					className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
					onClick={decreaseMonth}
					disabled={prevMonthButtonDisabled}
				>
					<ChevronLeft />
				</button>
				<div className="text-xl font-lexend">
					{date.toLocaleDateString('en-US', {
						month: 'long',
						year: 'numeric',
					})}
				</div>
				<button
					className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
					onClick={increaseMonth}
					disabled={nextMonthButtonDisabled}
				>
					<ChevronRight />
				</button>
			</div>
			{/* Horizontal line after header */}
			<hr className="border-t border-gray-200 mx-4" />
		</div>
	);

	// Function to check if a date is disabled
	const isDateDisabled = (date: Date) => {
		return disabledDates.some(disabledDate =>
			date.getDate() === disabledDate.getDate() &&
			date.getMonth() === disabledDate.getMonth() &&
			date.getFullYear() === disabledDate.getFullYear()
		);
	};

	// Function to check if a date is booked
	const isDateBooked = (date: Date) => {
		return bookedDates.some(bookedDate =>
			date.getDate() === bookedDate.getDate() &&
			date.getMonth() === bookedDate.getMonth() &&
			date.getFullYear() === bookedDate.getFullYear()
		);
	};

	// Custom day renderer
	const renderDayContents = (day: number, date: Date) => {
		if (isNaN(day)) return null;

		const todayMidnight = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const dateMidnight = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);

		const isPastDate = dateMidnight < todayMidnight;
		const isDisabled = isDateDisabled(date);
		const isBooked = isDateBooked(date);

		const isSelected =
			selectedDate &&
			date.getDate() === selectedDate.getDate() &&
			date.getMonth() === selectedDate.getMonth() &&
			date.getFullYear() === selectedDate.getFullYear();

		return (
			<div className="flex flex-col items-center">
				<div
					className={`
          flex flex-col items-center justify-center h-10 w-10 rounded-full mx-auto font-lexend
          ${isPastDate || isDisabled ? 'text-gray-300' : 'text-gray-700'}
          ${isSelected ? 'bg-green-100 border-2 border-green-300' : ''}
          ${!isPastDate && !isDisabled && !isSelected ? 'hover:bg-gray-100 hover:rounded-full' : ''}
          ${isDisabled ? 'cursor-not-allowed' : ''}
        `}
				>
					{day}
					{isBooked && (
						<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
					)}
				</div>
				{/* Green dot for booked dates */}

			</div>
		);
	};

	return (
		<div className="w-full font-lexend">
			{/* Lexend font */}
			<link
				href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>

			<DatePicker
				selected={selectedDate}
				onChange={(date: Date | null) => {
					if (date && !isDateDisabled(date)) {
						onDateSelect(date);
					}
				}}
				onMonthChange={(date: Date) => setCurrentMonth(date)}
				inline
				renderCustomHeader={CustomHeader}
				renderDayContents={renderDayContents}
				disabledKeyboardNavigation
				showPopperArrow={false}
				calendarClassName="w-full custom-calendar font-lexend"
				minDate={today}
				formatWeekDay={day => day.slice(0, 3).toUpperCase()}
				excludeDates={disabledDates} // Add disabled dates to DatePicker
			/>

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');

        .font-lexend {
          font-family: 'Lexend', sans-serif;
        }

        .react-datepicker {
          border: none;
          width: 100%;
          font-family: 'Lexend', sans-serif;
        }

        .react-datepicker * {
          font-family: 'Lexend', sans-serif;
        }

        .react-datepicker__month-container {
          width: 100%;
        }

        .react-datepicker__month {
          margin: 0;
          padding: 0 1rem 1rem;
        }

        .react-datepicker__week {
          display: flex;
          justify-content: space-between;
        }

        .react-datepicker__day {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          width: 40px;
          height: 40px;
        }

        .react-datepicker__header {
          background-color: white;
          border-bottom: none;
        }

        .react-datepicker__day-names {
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
          margin-bottom: 0.5rem;
        }

        .react-datepicker__day-name {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          color: #666;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background-color: transparent !important;
          color: black !important;
        }

        .react-datepicker__day:focus,
        .react-datepicker__day--selected:focus,
        .react-datepicker__day--keyboard-selected:focus {
          outline: none !important;
        }

        .react-datepicker__day:hover,
        .react-datepicker__day--selected:hover,
        .react-datepicker__day--keyboard-selected:hover {
          border-radius: 50% !important;
          background-color: #f3f4f6 !important;
        }
        
        .react-datepicker__day--excluded {
          cursor: not-allowed;
          color: #ccc !important;
        }
      `}</style>
		</div>
	);
};

export default CalendarContainer;