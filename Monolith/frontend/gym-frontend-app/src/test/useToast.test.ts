import useToast from '../hooks/useToast';
import { renderHook, act } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	toast: {
		custom: vi.fn(),
		remove: vi.fn(),
	},
}));

// Mock SVG imports with default exports
vi.mock('../assets/icons/success-icon.svg', () => ({
	default: 'success-icon-path',
}));

vi.mock('../assets/icons/error-icon.svg', () => ({
	default: 'error-icon-path',
}));

vi.mock('../assets/icons/close-icon.svg', () => ({
	default: 'close-icon-path',
}));

describe('useToast Hook', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		const { result } = renderHook(() => useToast());
		expect(result.current).toBeDefined();
		expect(result.current.showToast).toBeDefined();
	});

	it('should call toast.custom with success toast configuration', () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.showToast({
				type: 'success',
				title: 'Success Title',
				description: 'Success Description',
			});
		});

		// Check if toast.custom was called
		expect(toast.custom).toHaveBeenCalledTimes(1);

		// Get the first argument (render function) passed to toast.custom
		const renderFunction = toast.custom.mock.calls[0][0];

		// Create a mock toast object
		const mockToast = { id: 'mock-toast-id' };

		// Call the render function with the mock toast
		const renderedToast = renderFunction(mockToast);

		// Verify the rendered toast structure
		expect(renderedToast.type).toBe('div');
		expect(renderedToast.props.className).toContain('border-green-700');
		expect(renderedToast.props.className).toContain('bg-green-50');
	});

	it('should call toast.custom with error toast configuration', () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.showToast({
				type: 'error',
				title: 'Error Title',
				description: 'Error Description',
			});
		});

		// Check if toast.custom was called
		expect(toast.custom).toHaveBeenCalledTimes(1);

		// Get the first argument (render function) passed to toast.custom
		const renderFunction = toast.custom.mock.calls[0][0];

		// Create a mock toast object
		const mockToast = { id: 'mock-toast-id' };

		// Call the render function with the mock toast
		const renderedToast = renderFunction(mockToast);

		// Verify the rendered toast structure
		expect(renderedToast.type).toBe('div');
		expect(renderedToast.props.className).toContain('border-red-700');
		expect(renderedToast.props.className).toContain('bg-red-50');
	});

	it('should use the correct icon based on toast type', () => {
		const { result } = renderHook(() => useToast());

		// Test success icon
		act(() => {
			result.current.showToast({
				type: 'success',
				title: 'Success Title',
				description: 'Success Description',
			});
		});

		let renderFunction = toast.custom.mock.calls[0][0];
		let renderedToast = renderFunction({ id: 'mock-id' });
		let imgElement = renderedToast.props.children[0];

		expect(imgElement.type).toBe('img');
		expect(imgElement.props.src).toBe('success-icon-path');
		expect(imgElement.props.alt).toBe('success');

		// Clear mocks
		vi.clearAllMocks();

		// Test error icon
		act(() => {
			result.current.showToast({
				type: 'error',
				title: 'Error Title',
				description: 'Error Description',
			});
		});

		renderFunction = toast.custom.mock.calls[0][0];
		renderedToast = renderFunction({ id: 'mock-id' });
		imgElement = renderedToast.props.children[0];

		expect(imgElement.type).toBe('img');
		expect(imgElement.props.src).toBe('error-icon-path');
		expect(imgElement.props.alt).toBe('error');
	});

	it('should display the provided title and description', () => {
		const { result } = renderHook(() => useToast());

		const testTitle = 'Test Title';
		const testDescription = 'Test Description';

		act(() => {
			result.current.showToast({
				type: 'success',
				title: testTitle,
				description: testDescription,
			});
		});

		const renderFunction = toast.custom.mock.calls[0][0];
		const renderedToast = renderFunction({ id: 'mock-id' });
		const contentDiv = renderedToast.props.children[1];
		const titleElement = contentDiv.props.children[0];
		const descriptionElement = contentDiv.props.children[1];

		expect(titleElement.props.children).toBe(testTitle);
		expect(descriptionElement.props.children).toBe(testDescription);
	});

	it('should call toast.remove when close button is clicked', () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.showToast({
				type: 'success',
				title: 'Success Title',
				description: 'Success Description',
			});
		});

		const renderFunction = toast.custom.mock.calls[0][0];
		const mockToastId = 'mock-toast-id';
		const renderedToast = renderFunction({ id: mockToastId });
		const closeButton = renderedToast.props.children[2];

		// Simulate click on close button
		act(() => {
			closeButton.props.onClick();
		});

		// Verify toast.remove was called with the correct ID
		expect(toast.remove).toHaveBeenCalledTimes(1);
		expect(toast.remove).toHaveBeenCalledWith(mockToastId);
	});

	it('should set position to top-center', () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.showToast({
				type: 'success',
				title: 'Success Title',
				description: 'Success Description',
			});
		});

		// Check the options passed to toast.custom
		const options = toast.custom.mock.calls[0][1];
		expect(options).toEqual({ position: 'top-center' });
	});

	it('should set minimum height style', () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.showToast({
				type: 'success',
				title: 'Success Title',
				description: 'Success Description',
			});
		});

		const renderFunction = toast.custom.mock.calls[0][0];
		const renderedToast = renderFunction({ id: 'mock-id' });

		expect(renderedToast.props.style).toEqual({ minHeight: '70px' });
	});
});
