/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../components/common/form/Select';
import { describe, expect, it } from 'vitest';

// Mock options for testing
const mockOptions = [
	{ value: 'option1', label: 'Option 1' },
	{ value: 'option2', label: 'Option 2' },
	{ value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
	// Basic rendering tests
	it('renders with required props', () => {
		render(<Select options={mockOptions} />);

		// Should show first option by default
		expect(screen.getByText('Option 1')).toBeInTheDocument();
	});

	it('renders with custom label', () => {
		render(<Select options={mockOptions} label="Test Label" />);

		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('renders with placeholder when no value is selected', () => {
		// Prevent auto-selection by providing empty options
		render(<Select options={[]} placeholder="Select something" />);

		expect(screen.getByText('Select something')).toBeInTheDocument();
	});

	// Dropdown functionality tests
	it('opens dropdown when clicked', async () => {
		render(<Select options={mockOptions} />);

		const combobox = screen.getByRole('combobox');
		await userEvent.click(combobox);

		// Check if the listbox is visible
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		// Check for options within the listbox
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');
		expect(options).toHaveLength(3);
		expect(options[0]).toHaveTextContent('Option 1');
		expect(options[1]).toHaveTextContent('Option 2');
		expect(options[2]).toHaveTextContent('Option 3');
	});

	it('closes dropdown when an option is selected', async () => {
		render(<Select options={mockOptions} />);

		// Open dropdown
		await userEvent.click(screen.getByRole('combobox'));

		// Select an option (the second one)
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');
		await userEvent.click(options[1]);

		// Dropdown should be closed
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('calls onChange when an option is selected', async () => {
		const handleChange = vi.fn();
		render(<Select options={mockOptions} onChange={handleChange} />);

		// Open dropdown
		await userEvent.click(screen.getByRole('combobox'));

		// Select an option (the second one)
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');
		await userEvent.click(options[1]);

		// onChange should be called with the selected value
		expect(handleChange).toHaveBeenCalledWith('option2');
	});

	// Value and selection tests
	it('displays the selected option based on value prop', () => {
		render(<Select options={mockOptions} value="option2" />);

		const combobox = screen.getByRole('combobox');
		const selectedText = within(combobox).getByText('Option 2');
		expect(selectedText).toBeInTheDocument();
	});

	it('selects first option by default when value is undefined', () => {
		const handleChange = vi.fn();
		render(<Select options={mockOptions} onChange={handleChange} />);

		// onChange should be called with the first option's value
		expect(handleChange).toHaveBeenCalledWith('option1');
	});

	// Disabled state tests
	it('does not open dropdown when disabled', async () => {
		render(<Select options={mockOptions} disabled />);

		await userEvent.click(screen.getByRole('combobox'));

		// Dropdown should not be visible
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('applies disabled styling', () => {
		render(<Select options={mockOptions} disabled />);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-disabled',
			'true'
		);
		expect(screen.getByRole('combobox')).toHaveClass('opacity-70');
	});

	// Loading state tests
	it('shows loading state when isLoading is true', () => {
		render(<Select options={mockOptions} isLoading />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-disabled',
			'true'
		);
	});

	it('does not open dropdown when loading', async () => {
		render(<Select options={mockOptions} isLoading />);

		await userEvent.click(screen.getByRole('combobox'));

		// Dropdown should not be visible
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	// Icon tests
	it('renders with left icon', () => {
		const leftIcon = <span data-testid="left-icon">←</span>;
		render(<Select options={mockOptions} leftIcon={leftIcon} />);

		expect(screen.getByTestId('left-icon')).toBeInTheDocument();
	});

	it('renders with right icon', () => {
		const rightIcon = <span data-testid="right-icon">→</span>;
		render(<Select options={mockOptions} rightIcon={rightIcon} />);

		expect(screen.getByTestId('right-icon')).toBeInTheDocument();
	});

	it('renders default chevron icon when no right icon is provided', () => {
		render(<Select options={mockOptions} />);

		// Check for SVG icon (ChevronDown)
		const svg = document.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	// Size tests
	it('applies small size styles', () => {
		render(<Select options={mockOptions} size="small" />);

		expect(screen.getByRole('combobox')).toHaveClass('text-sm');
	});

	it('applies medium size styles', () => {
		render(<Select options={mockOptions} size="medium" />);

		expect(screen.getByRole('combobox')).toHaveClass('text-base');
	});

	it('applies large size styles', () => {
		render(<Select options={mockOptions} size="large" />);

		expect(screen.getByRole('combobox')).toHaveClass('text-lg');
	});

	// Width tests
	it('applies full width when fullWidth is true', () => {
		render(<Select options={mockOptions} fullWidth />);

		expect(screen.getByRole('combobox')).toHaveClass('w-full');
	});

	// Custom class tests
	it('applies custom className', () => {
		render(<Select options={mockOptions} className="custom-class" />);

		expect(screen.getByRole('combobox')).toHaveClass('custom-class');
	});

	// Keyboard navigation tests
	it('opens dropdown with Space key', async () => {
		render(<Select options={mockOptions} />);

		const combobox = screen.getByRole('combobox');
		combobox.focus();
		await userEvent.keyboard(' ');

		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('opens dropdown with Enter key', async () => {
		render(<Select options={mockOptions} />);

		const combobox = screen.getByRole('combobox');
		combobox.focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('closes dropdown with Escape key', async () => {
		render(<Select options={mockOptions} />);

		// Open dropdown
		const combobox = screen.getByRole('combobox');
		await userEvent.click(combobox);

		// Press Escape
		await userEvent.keyboard('{Escape}');

		// Dropdown should be closed
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('navigates options with arrow keys', async () => {
		render(<Select options={mockOptions} />);

		// Open dropdown
		const combobox = screen.getByRole('combobox');
		await userEvent.click(combobox);

		// Press down arrow to focus first option
		await userEvent.keyboard('{ArrowDown}');

		// Get all options
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');

		// First option should have focus styling
		expect(options[0]).toHaveClass('bg-green-100');

		// Press down arrow again to focus second option
		await userEvent.keyboard('{ArrowDown}');

		// Second option should now have focus styling
		expect(options[1]).toHaveClass('bg-green-100');
	});

	it('selects focused option with Enter key', async () => {
		const handleChange = vi.fn();
		render(<Select options={mockOptions} onChange={handleChange} />);

		// Open dropdown
		const combobox = screen.getByRole('combobox');
		await userEvent.click(combobox);

		// Navigate to second option
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{ArrowDown}');

		// Select with Enter
		await userEvent.keyboard('{Enter}');

		// onChange should be called with the second option's value
		expect(handleChange).toHaveBeenCalledWith('option2');

		// Dropdown should be closed
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	// Outside click tests
	it('closes dropdown when clicking outside', async () => {
		render(
			<div>
				<Select options={mockOptions} />
				<div data-testid="outside">Outside</div>
			</div>
		);

		// Open dropdown
		await userEvent.click(screen.getByRole('combobox'));

		// Dropdown should be visible
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		// Click outside
		await userEvent.click(screen.getByTestId('outside'));

		// Dropdown should be closed
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	// Edge cases
	it('handles empty options array', () => {
		render(<Select options={[]} />);

		// Should show placeholder
		expect(screen.getByText('Select an option')).toBeInTheDocument();
	});

	it('highlights selected option in dropdown', async () => {
		render(<Select options={mockOptions} value="option2" />);

		// Open dropdown
		await userEvent.click(screen.getByRole('combobox'));

		// Get all options
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');

		// Second option should have selected styling
		expect(options[1]).toHaveClass('font-medium');
		expect(options[1]).toHaveClass('bg-green-100');
	});

	// Accessibility tests
	it('has correct ARIA attributes', () => {
		render(<Select options={mockOptions} />);

		const combobox = screen.getByRole('combobox');
		expect(combobox).toHaveAttribute('aria-expanded', 'false');
		expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');

		// Open dropdown
		fireEvent.click(combobox);

		expect(combobox).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		// Options should have aria-selected
		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');
		expect(options[0]).toHaveAttribute('aria-selected', 'true'); // First option is selected by default
		expect(options[1]).toHaveAttribute('aria-selected', 'false');
	});

	it('is keyboard focusable', async () => {
		render(<Select options={mockOptions} />);

		// Tab to focus the select
		await userEvent.tab();

		expect(screen.getByRole('combobox')).toHaveFocus();
	});

	// Snapshot test
	it('matches snapshot', () => {
		const { container } = render(
			<Select options={mockOptions} label="Test Select" />
		);
		expect(container).toMatchSnapshot();
	});
});
