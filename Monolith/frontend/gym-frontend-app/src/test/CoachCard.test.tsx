import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; // Import from react-router-dom, not react-router
import CoachCard from '../components/coaches/CoachCard';

// Mock react-router's useNavigate
vi.mock('react-router', () => ({
	useNavigate: () => mockNavigate,
}));

// Create the mock navigate function
const mockNavigate = vi.fn();

// Mock coach data
const mockCoach = {
	id: '123',
	name: 'John Doe',
	summary: 'Fitness Expert',
	motivationPitch:
		'I will help you achieve your fitness goals with personalized training programs.',
	rating: 4.85,
	imageUrl: 'https://example.com/coach-image.jpg',
	specializations: ['Yoga', 'Strength Training'],
};

// Mock coach without image
const mockCoachNoImage = {
	...mockCoach,
	imageUrl: '',
};

describe('CoachCard Component', () => {
	// Reset mocks before each test
	beforeEach(() => {
		mockNavigate.mockReset();
	});

	// Helper function to render component within router context
	const renderCoachCard = (coach = mockCoach) => {
		return render(
			<MemoryRouter>
				<CoachCard coach={coach} />
			</MemoryRouter>
		);
	};

	it('renders coach information correctly', () => {
		renderCoachCard();

		// Check if name is displayed
		expect(screen.getByText('John Doe')).toBeInTheDocument();

		// Check if title (summary) is displayed
		expect(screen.getByText('Fitness Expert')).toBeInTheDocument();

		// Check if description (motivationPitch) is displayed
		expect(
			screen.getByText(
				'I will help you achieve your fitness goals with personalized training programs.'
			)
		).toBeInTheDocument();

		// Check if rating is displayed and formatted correctly
		expect(screen.getByText('4.85')).toBeInTheDocument();
	});

	it('displays the coach image when provided', () => {
		renderCoachCard();

		const image = screen.getByAltText('John Doe');
		expect(image).toBeInTheDocument();
		expect(image.getAttribute('src')).toBe(
			'https://example.com/coach-image.jpg'
		);
	});

	it('displays a placeholder image when no image is provided', () => {
		renderCoachCard(mockCoachNoImage);

		const image = screen.getByAltText('John Doe');
		expect(image).toBeInTheDocument();
		expect(image.getAttribute('src')).toBe('/placeholder.svg');
	});

	it('navigates to coach detail page when "Book Workout" button is clicked', async () => {
		renderCoachCard();

		const bookButton = screen.getByText('Book Workout');
		expect(bookButton).toBeInTheDocument();

		// Click the button
		await userEvent.click(bookButton);

		// Check if navigation was called with the correct path
		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('/coaches/123');
	});

	it('renders the star icon for rating', () => {
		renderCoachCard();

		// Check if the SVG star icon is rendered
		const starIcon = document.querySelector('svg');
		expect(starIcon).toBeInTheDocument();
		expect(starIcon?.classList.contains('text-yellow-400')).toBe(true);
	});

	it('applies correct styling to the card', () => {
		const { container } = renderCoachCard();

		// Check main card container
		const cardContainer = container.firstChild;
		expect(cardContainer).toHaveClass('flex');
		expect(cardContainer).toHaveClass('flex-col');
		expect(cardContainer).toHaveClass('rounded-2xl');
		expect(cardContainer).toHaveClass('bg-white');
		expect(cardContainer).toHaveClass('shadow-lg');

		// Check image container
		const imageContainer = container.querySelector('.aspect-\\[4\\/3\\]');
		expect(imageContainer).toBeInTheDocument();

		// Check content container
		const contentContainer = container.querySelector('.p-5');
		expect(contentContainer).toBeInTheDocument();
	});

	it('truncates long description text with line-clamp-3', () => {
		const longDescriptionCoach = {
			...mockCoach,
			motivationPitch:
				'This is a very long description that should be truncated. '.repeat(
					10
				),
		};

		renderCoachCard(longDescriptionCoach);

		const description = screen.getByText(/This is a very long description/);
		expect(description).toHaveClass('line-clamp-3');
	});

	it('formats rating to 2 decimal places', () => {
		const coachWithUglyRating = {
			...mockCoach,
			rating: 4.8333333,
		};

		renderCoachCard(coachWithUglyRating);

		// Should display as 4.83, not 4.8333333
		expect(screen.getByText('4.83')).toBeInTheDocument();
	});

	it('renders a Button component for booking', () => {
		renderCoachCard();

		const button = screen.getByRole('button', { name: 'Book Workout' });
		expect(button).toBeInTheDocument();
	});

	// Snapshot test
	it('matches snapshot', () => {
		const { container } = renderCoachCard();
		expect(container).toMatchSnapshot();
	});
});
