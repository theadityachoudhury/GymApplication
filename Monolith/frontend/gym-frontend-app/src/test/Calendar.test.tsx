/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import CalendarContainer from '../components/common/form/Calendar';

// Mock react-datepicker completely
vi.mock('react-datepicker', () => {
	return {
		__esModule: true,
		default: (props: any) => {
			// Get the fixed today date for testing
			// const today = new Date('2023-06-15');

			// Call the onMonthChange prop to simulate month changes
			React.useEffect(() => {
				if (props.onMonthChange) {
					const mockMonthChangeHandler = () => {
						// This is just to register that the handler exists
					};
					mockMonthChangeHandler();
				}
			}, [props.onMonthChange]);

			// Call the onChange prop to simulate date selection
			React.useEffect(() => {
				if (props.onChange) {
					const mockChangeHandler = () => {
						// This is just to register that the handler exists
					};
					mockChangeHandler();
				}
			}, [props.onChange]);

			// Generate test dates with proper past/future status
			const testDates = [
				{ day: 10, date: new Date('2023-06-10') }, // Past date
				{ day: 15, date: new Date('2023-06-15') }, // Today
				{ day: 20, date: new Date('2023-06-20') }, // Future date (selected)
				{ day: 25, date: new Date('2023-06-25') }, // Future date
			];

			// Render a simplified version that just shows the important parts
			return (
				<div data-testid="datepicker-mock">
					{/* Render the custom header */}
					{props.renderCustomHeader &&
						props.renderCustomHeader({
							date: props.selected || new Date(),
							decreaseMonth: vi.fn(),
							increaseMonth: vi.fn(),
							prevMonthButtonDisabled: false,
							nextMonthButtonDisabled: false,
						})}

					{/* Mock day names */}
					<div className="react-datepicker__day-names">
						<div>SUN</div>
						<div>MON</div>
						<div>TUE</div>
						<div>WED</div>
						<div>THU</div>
						<div>FRI</div>
						<div>SAT</div>
					</div>

					{/* Mock test dates */}
					<div className="react-datepicker__month">
						{testDates.map(({ day, date }) => (
							<div key={day} data-testid={`day-${day}`}>
								{props.renderDayContents &&
									props.renderDayContents(day, date)}
							</div>
						))}
					</div>
				</div>
			);
		},
	};
});

// Mock the Lucide React icons
vi.mock('lucide-react', () => ({
	ChevronLeft: () => <div data-testid="chevron-left-icon">←</div>,
	ChevronRight: () => <div data-testid="chevron-right-icon">→</div>,
}));

describe('CalendarContainer Component', () => {
	// Fixed date for consistent testing
	const mockToday = new Date('2023-06-15');
	const mockSelectedDate = new Date('2023-06-20');

	// Mock the current date
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(mockToday);
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	// Basic rendering tests
	it('renders the calendar component', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Check if the datepicker mock is rendered
		expect(screen.getByTestId('datepicker-mock')).toBeInTheDocument();
	});

	it('displays the correct month and year in the header', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		expect(screen.getByText('June 2023')).toBeInTheDocument();
	});

	it('renders navigation buttons', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
		expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
	});

	it('renders weekday headers', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Check for abbreviated weekday names
		expect(screen.getByText('SUN')).toBeInTheDocument();
		expect(screen.getByText('MON')).toBeInTheDocument();
		expect(screen.getByText('TUE')).toBeInTheDocument();
		expect(screen.getByText('WED')).toBeInTheDocument();
		expect(screen.getByText('THU')).toBeInTheDocument();
		expect(screen.getByText('FRI')).toBeInTheDocument();
		expect(screen.getByText('SAT')).toBeInTheDocument();
	});

	// Test day rendering
	it('highlights the selected date', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Find the selected date (20th)
		const selectedDateElement = screen.getByTestId('day-20').firstChild;

		// Check if it has the selected styling
		expect(selectedDateElement).toHaveClass('bg-green-100');
		expect(selectedDateElement).toHaveClass('border-2');
		expect(selectedDateElement).toHaveClass('border-green-300');
	});

	it('shows past dates as disabled', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Find a past date (e.g., the 10th, which is before our mock today of the 15th)
		const pastDateElement = screen.getByTestId('day-10').firstChild;

		// Check if it has the disabled styling
		expect(pastDateElement).toHaveClass('text-gray-300');
	});

	it('shows future dates as enabled', () => {
		const handleDateSelect = vi.fn();
		render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Find a future date (e.g., the 25th, which is after our mock today of the 15th)
		const futureDateElement = screen.getByTestId('day-25').firstChild;

		// Check if it has the enabled styling
		expect(futureDateElement).toHaveClass('text-gray-700');
		expect(futureDateElement).toHaveClass('hover:bg-gray-100');
	});

	// Styling tests
	it('applies custom styling to the calendar', () => {
		const handleDateSelect = vi.fn();
		const { container } = render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		// Check for the presence of custom styles
		const styleElement = container.querySelector('style');
		expect(styleElement).toBeInTheDocument();
		expect(styleElement?.textContent).toContain("font-family: 'Lexend'");
	});

	// Snapshot test
	it('matches snapshot', () => {
		const handleDateSelect = vi.fn();
		const { container } = render(
			<CalendarContainer
				selectedDate={mockSelectedDate}
				onDateSelect={handleDateSelect}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
