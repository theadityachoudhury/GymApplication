import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'outline' | 'text' | 'red';
	size?: 'small' | 'medium' | 'large';
	fullWidth?: boolean;
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
}

const Button = ({
	children,
	variant = 'primary',
	size = 'medium',
	fullWidth = false,
	isLoading = false,
	leftIcon,
	rightIcon,
	className = '',
	disabled,
	type = 'button',
	...rest
}: ButtonProps) => {
	// Base styles for all buttons
	const baseStyles =
		'rounded-md font-medium transition-all flex items-center justify-center disabled:cursor-not-allowed';

	// Variant styles
	const variantStyles = {
		red:
			'border border-primary-black text-primary-black hover:bg-red-500 hover:bg-opacity-10 hover:text-white cursor-pointer',
		primary:
			'bg-primary-green text-black hover:bg-primary-white border border-primary-green hover:border-black cursor-pointer',
		outline:
			'border border-primary-black text-primary-black hover:bg-primary-green hover:bg-opacity-10 cursor-pointer',
		text: 'cursor-pointer',
	};

	// Size styles
	const sizeStyles = {
		small: 'text-sm py-2 px-3',
		medium: 'text-base py-3 px-4',
		large: 'text-lg py-3.5 px-6',
	};

	// Width styles
	const widthStyles = fullWidth ? 'w-full' : '';

	// Disabled styles
	const disabledStyles =
		disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';

	return (
		<button
			type={type}
			className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `}
			disabled={disabled || isLoading}
			{...rest}
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
					{children}
					{rightIcon && <span className="ml-2">{rightIcon}</span>}
				</>
			)}
		</button>
	);
};

export default Button;
