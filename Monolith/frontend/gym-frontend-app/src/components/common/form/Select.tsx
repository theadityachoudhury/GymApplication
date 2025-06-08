import {
	SelectHTMLAttributes,
	ReactNode,
	useState,
	useRef,
	useEffect,
} from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps
	extends Omit<
		SelectHTMLAttributes<HTMLSelectElement>,
		'onChange' | 'size' | 'value'
	> {
	options: SelectOption[];
	label?: string;
	variant?: 'primary';
	size?: 'small' | 'medium' | 'large';
	fullWidth?: boolean;
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	value?: string;
}

const Select = ({
	options,
	label,
	variant = 'primary',
	size = 'medium',
	fullWidth = false,
	isLoading = false,
	leftIcon,
	rightIcon,
	className = '',
	disabled,
	onChange,
	placeholder = 'Select an option',
	value,
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const selectRef = useRef<HTMLFieldSetElement>(null);

	// Initialize with first option if value is undefined and options exist
	useEffect(() => {
		if (value === undefined && options.length > 0 && onChange) {
			onChange(options[0].value);
		}
	}, [onChange, options, value]);

	// Find the currently selected option based on value prop
	const selectedOption =
		options.find(option => option.value === value) ||
		(options.length > 0 ? options[0] : null);

	// Base styles for the select container
	const baseStyles =
		'rounded-md font-medium transition-all flex items-center justify-between relative';

	// Variant styles
	const variantStyles = {
		primary: 'text-neutral-700 cursor-pointer',
	};

	// Size styles
	const sizeStyles = {
		small: ' py-2 px-3',
		medium: ' py-2 px-4',
		large: ' py-2 px-6',
	};

	// Width styles
	const widthStyles = fullWidth ? 'w-full' : '';

	// Disabled styles
	const disabledStyles =
		disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';

	// Handle outside clicks to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Handle option selection
	const handleSelectOption = (option: SelectOption) => {
		setIsOpen(false);
		if (onChange) {
			onChange(option.value);
		}
	};

	// Keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled || isLoading) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
				} else {
					setFocusedIndex(prev =>
						prev < options.length - 1 ? prev + 1 : prev
					);
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (isOpen) {
					setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
				}
				break;
			case 'Enter':
			case ' ': // Space
				e.preventDefault();
				if (isOpen && focusedIndex >= 0) {
					handleSelectOption(options[focusedIndex]);
				} else {
					setIsOpen(!isOpen);
				}
				break;
			case 'Escape':
				e.preventDefault();
				setIsOpen(false);
				break;
			default:
				break;
		}
	};

	return (
		<fieldset
			className="flex flex-col rounded-md border text-primary-black px-1 border-neutral-200 focus-within:border-1 focus-within:border-primary-black"
			ref={selectRef}
		>
			{label && (
				<legend className="text-xs text-neutral-700 px-2">
					{label}
				</legend>
			)}
			<div
				className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyles}
          ${disabledStyles}
          ${className}
        `}
				tabIndex={disabled ? -1 : 0}
				onKeyDown={handleKeyDown}
				onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-disabled={disabled || isLoading}
			>
				{isLoading ? (
					<>
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Loading...
					</>
				) : (
					<>
						{leftIcon && <span className="mr-2">{leftIcon}</span>}
						<span className="flex-grow text-left text-primary-black font-normal truncate">
							{selectedOption
								? selectedOption.label
								: placeholder}
						</span>
						{rightIcon || (
							<ChevronDown
								className={`ml-2 h-3 w-3 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
							/>
						)}
					</>
				)}

				{/* Dropdown menu */}
				{isOpen && !disabled && !isLoading && (
					<div
						className="absolute left-0 right-0 top-full mt-1 overflow-auto scrollbar-hide z-10 bg-white border border-gray-200 rounded-md shadow-lg"
						role="listbox"
					>
						{options.map((option, index) => (
							<div
								key={option.value}
								className={`
                  px-4 py-2 cursor-pointer hover:bg-green-100 hover:bg-opacity-10
                  ${focusedIndex === index ? 'bg-green-100 bg-opacity-10' : ''}
                  ${selectedOption?.value === option.value ? 'font-medium bg-green-100 bg-opacity-20' : ''}
                `}
								onClick={() => handleSelectOption(option)}
								role="option"
								aria-selected={
									selectedOption?.value === option.value
								}
								onMouseEnter={() => setFocusedIndex(index)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		</fieldset>
	);
};

export default Select;
