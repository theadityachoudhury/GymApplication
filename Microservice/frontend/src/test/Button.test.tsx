// src/components/Button.test.tsx
import Button from '../components/common/ui/CustomButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
	// Basic rendering tests
	it('renders correctly with default props', () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole('button', { name: /click me/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-primary-green'); // Primary variant
	});

	it('renders with custom text', () => {
		render(<Button>Custom Text</Button>);
		expect(screen.getByText('Custom Text')).toBeInTheDocument();
	});

	// Variant tests
	it('renders with primary variant styles', () => {
		render(<Button variant="primary">Primary Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-primary-green');
		expect(button).toHaveClass('text-black');
	});

	it('renders with outline variant styles', () => {
		render(<Button variant="outline">Outline Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('border-primary-black');
		expect(button).toHaveClass('text-primary-black');
	});

	it('renders with text variant styles', () => {
		render(<Button variant="text">Text Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('cursor-pointer');
	});

	// Size tests
	it('renders with small size', () => {
		render(<Button size="small">Small Button</Button>);
		expect(screen.getByRole('button')).toHaveClass('text-sm');
	});

	it('renders with medium size', () => {
		render(<Button size="medium">Medium Button</Button>);
		expect(screen.getByRole('button')).toHaveClass('text-base');
	});

	it('renders with large size', () => {
		render(<Button size="large">Large Button</Button>);
		expect(screen.getByRole('button')).toHaveClass('text-lg');
	});

	// Width test
	it('renders with full width when fullWidth is true', () => {
		render(<Button fullWidth>Full Width Button</Button>);
		expect(screen.getByRole('button')).toHaveClass('w-full');
	});

	// Loading state test
	it('shows loading state when isLoading is true', () => {
		render(<Button isLoading>Click me</Button>);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText('Click me')).not.toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});

	// Disabled state test
	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled Button</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
		expect(screen.getByRole('button')).toHaveClass('opacity-70');
	});

	// Icon tests
	it('renders with left icon', () => {
		const leftIcon = <span data-testid="left-icon">←</span>;
		render(<Button leftIcon={leftIcon}>With Left Icon</Button>);
		expect(screen.getByTestId('left-icon')).toBeInTheDocument();
	});

	it('renders with right icon', () => {
		const rightIcon = <span data-testid="right-icon">→</span>;
		render(<Button rightIcon={rightIcon}>With Right Icon</Button>);
		expect(screen.getByTestId('right-icon')).toBeInTheDocument();
	});

	// Event handling test
	it('calls onClick handler when clicked', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		await userEvent.click(screen.getByRole('button'));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', async () => {
		const handleClick = vi.fn();
		render(
			<Button onClick={handleClick} disabled>
				Click me
			</Button>
		);

		await userEvent.click(screen.getByRole('button'));

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when loading', async () => {
		const handleClick = vi.fn();
		render(
			<Button onClick={handleClick} isLoading>
				Click me
			</Button>
		);

		await userEvent.click(screen.getByRole('button'));

		expect(handleClick).not.toHaveBeenCalled();
	});

	// Custom class test
	it('applies custom className', () => {
		render(<Button className="custom-class">Custom Class Button</Button>);
		expect(screen.getByRole('button')).toHaveClass('custom-class');
	});

	// Button type test
	it('has button type by default', () => {
		render(<Button>Default Type</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('can have submit type', () => {
		render(<Button type="submit">Submit Button</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	// Additional tests to make the suite more comprehensive

	// Accessibility tests
	it('is keyboard focusable', async () => {
		render(<Button>Focusable Button</Button>);
		const button = screen.getByRole('button');

		// Tab to focus the button
		await userEvent.tab();

		expect(button).toHaveFocus();
	});

	// Complex children test
	it('renders complex children correctly', () => {
		render(
			<Button>
				<div data-testid="complex-child">
					<span>Nested</span> <strong>Content</strong>
				</div>
			</Button>
		);

		expect(screen.getByTestId('complex-child')).toBeInTheDocument();
		expect(screen.getByText('Nested')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	// Combined states test
	it('handles both loading and disabled states correctly', () => {
		render(
			<Button isLoading disabled>
				Button Text
			</Button>
		);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
		expect(screen.getByRole('button')).toHaveClass('opacity-70');
	});

	// Snapshot test
	it('matches snapshot for primary button', () => {
		const { container } = render(<Button>Snapshot Test</Button>);
		expect(container).toMatchSnapshot();
	});
});
