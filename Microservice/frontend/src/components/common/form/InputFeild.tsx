import React, { forwardRef } from 'react';

interface InputFieldProps {
	label: string;
	name: string;
	type?: 'text' | 'password' | 'phone' | 'email' | 'tel';
	placeholder?: string;
	id?: string;
	className?: string;
	error?: string;
	value?: string;
	helperText?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			label,
			name,
			type = 'text',
			placeholder,
			id,
			className,
			error,
			value,
			helperText,
			onChange,
		},
		ref
	) => {
		return (
			<div className={`w-full `}>
				<fieldset
					className={`relative w-full border rounded-md px-3 pt-2 pb-2 text-primary-black focus-within:border-1 focus-within:border-primary-black ${error ? 'border-red-500' : 'border-neutral-200'
						}`}
				>
					<legend
						className={`absolute left-2 transition-all px-1 text-form-input -top-3 bg-white`}
					>
						{label}
					</legend>
					<input
						type={type}
						id={id}
						name={name}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						ref={ref}
						className={`w-full pb-1 outline-none bg-transparent border-none text-base pt-1 ${className}`}
					/>
				</fieldset>

				{error && <p className="mt-1 error-text">{error}</p>}

				{helperText && !error && (
					<p className="mt-1 mx-2 text-xs text-neutral-600">
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

export default InputField;
