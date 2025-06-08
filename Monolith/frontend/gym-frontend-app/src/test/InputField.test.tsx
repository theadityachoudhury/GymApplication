/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from '../components/common/form/InputFeild';

describe('InputField Component', () => {
	// Basic rendering tests
	it('renders with required props', () => {
		render(<InputField label="Username" name="username" />);

		expect(screen.getByText('Username')).toBeInTheDocument();
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('name', 'username');
	});

	it('renders with default type as text', () => {
		render(<InputField label="Username" name="username" />);

		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
	});

	// Props tests
	it('renders with custom type', () => {
		const { container } = render(
			<InputField label="Password" name="password" type="password" />
		);

		// Password inputs don't have role="textbox", so we need to query by attribute
		const input = container.querySelector('input[type="password"]');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('name', 'password');
	});

	it('renders with placeholder', () => {
		render(
			<InputField
				label="Username"
				name="username"
				placeholder="Enter your username"
			/>
		);

		expect(
			screen.getByPlaceholderText('Enter your username')
		).toBeInTheDocument();
	});

	it('renders with custom id', () => {
		render(<InputField label="Username" name="username" id="custom-id" />);

		expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
	});

	it('applies custom className', () => {
		const { container } = render(
			<InputField
				label="Username"
				name="username"
				className="custom-class"
			/>
		);

		// Check if the wrapper div has the custom class
		expect(container.firstChild).toHaveClass('custom-class');
	});

	it('displays error message when provided', () => {
		render(
			<InputField
				label="Username"
				name="username"
				error="Username is required"
			/>
		);

		expect(screen.getByText('Username is required')).toBeInTheDocument();
		expect(screen.getByText('Username is required')).toHaveClass(
			'text-red-500'
		);
	});

	it('applies error styling to fieldset when error is provided', () => {
		const { container } = render(
			<InputField
				label="Username"
				name="username"
				error="Username is required"
			/>
		);

		const fieldset = container.querySelector('fieldset');
		expect(fieldset).toHaveClass('border-red-500');
	});

	it('displays helper text when provided and no error', () => {
		render(
			<InputField
				label="Username"
				name="username"
				helperText="Must be at least 3 characters"
			/>
		);

		expect(
			screen.getByText('Must be at least 3 characters')
		).toBeInTheDocument();
		expect(screen.getByText('Must be at least 3 characters')).toHaveClass(
			'text-neutral-600'
		);
	});

	it('does not display helper text when error is present', () => {
		render(
			<InputField
				label="Username"
				name="username"
				error="Username is required"
				helperText="Must be at least 3 characters"
			/>
		);

		expect(screen.getByText('Username is required')).toBeInTheDocument();
		expect(
			screen.queryByText('Must be at least 3 characters')
		).not.toBeInTheDocument();
	});

	// Value and onChange tests
	it('displays the provided value', () => {
		const handleChange = vi.fn(); // Add onChange to prevent warning
		render(
			<InputField
				label="Username"
				name="username"
				value="testuser"
				onChange={handleChange}
			/>
		);

		expect(screen.getByRole('textbox')).toHaveValue('testuser');
	});

	it('calls onChange handler when input changes', async () => {
		const handleChange = vi.fn();
		render(
			<InputField
				label="Username"
				name="username"
				onChange={handleChange}
			/>
		);

		await userEvent.type(screen.getByRole('textbox'), 'test');

		expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
	});

	// Ref forwarding test
	it('forwards ref to input element', () => {
		const ref = React.createRef<HTMLInputElement>();
		render(<InputField label="Username" name="username" ref={ref} />);

		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName).toBe('INPUT');
	});

	// Accessibility tests
	it('maintains accessible association between label and input', () => {
		const { container } = render(
			<InputField label="Username" name="username" id="username-input" />
		);

		// Check if the legend text matches the label
		const legend = container.querySelector('legend');
		expect(legend).toHaveTextContent('Username');

		// Check if the input exists
		const input = container.querySelector('input#username-input');
		expect(input).toBeInTheDocument();
	});

	it('is keyboard navigable', async () => {
		render(<InputField label="Username" name="username" />);

		// Tab to focus the input
		await userEvent.tab();

		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	// Different input types
	it('renders email input type correctly', () => {
		render(<InputField label="Email" name="email" type="email" />);

		// Email inputs still have role="textbox"
		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
	});

	it('renders phone input type correctly', () => {
		const { container } = render(
			<InputField label="Phone" name="phone" type="phone" />
		);

		// Use querySelector instead of getByRole
		const input = container.querySelector('input[type="phone"]');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('name', 'phone');
	});

	// Edge cases
	it('handles empty values correctly', () => {
		const handleChange = vi.fn(); // Add onChange to prevent warning
		render(
			<InputField
				label="Username"
				name="username"
				value=""
				onChange={handleChange}
			/>
		);

		expect(screen.getByRole('textbox')).toHaveValue('');
	});

	it('handles input focus and blur events', async () => {
		render(<InputField label="Username" name="username" />);
		const input = screen.getByRole('textbox');

		// Focus the input
		await userEvent.click(input);
		expect(input).toHaveFocus();

		// Blur the input
		await userEvent.tab();
		expect(input).not.toHaveFocus();
	});

	// Visual appearance tests
	it('has correct styling for legend element', () => {
		const { container } = render(
			<InputField label="Username" name="username" />
		);

		const legend = container.querySelector('legend');
		expect(legend).toHaveClass('text-primary-black');
		expect(legend).toHaveClass('bg-white');
	});

	it('has correct styling for input element', () => {
		const { container } = render(
			<InputField label="Username" name="username" />
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveClass('w-full');
		expect(input).toHaveClass('outline-none');
		expect(input).toHaveClass('bg-transparent');
	});

	// Snapshot test
	it('matches snapshot', () => {
		const { container } = render(
			<InputField
				label="Username"
				name="username"
				placeholder="Enter username"
				helperText="Must be at least 3 characters"
			/>
		);

		expect(container).toMatchSnapshot();
	});

	// Controlled component behavior
	it('functions as a controlled component', async () => {
		const handleChange = vi.fn();
		const { rerender } = render(
			<InputField
				label="Username"
				name="username"
				value="initial"
				onChange={handleChange}
			/>
		);

		expect(screen.getByRole('textbox')).toHaveValue('initial');

		// Simulate typing
		await userEvent.type(screen.getByRole('textbox'), 'x');

		// Verify onChange was called
		expect(handleChange).toHaveBeenCalled();

		// Update the component with new value (as a parent component would do)
		rerender(
			<InputField
				label="Username"
				name="username"
				value="updated"
				onChange={handleChange}
			/>
		);

		// Verify the value was updated
		expect(screen.getByRole('textbox')).toHaveValue('updated');
	});
});
