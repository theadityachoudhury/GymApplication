import { useState, useRef, useEffect, KeyboardEvent, forwardRef } from 'react';
import { SelectOption } from './Select';

interface TagInputFieldProps {
	label: string;
	name: string;
	id?: string;
	className?: string;
	error?: string;
	helperText?: string;
	placeholder?: string;
	value?: SelectOption[];
	onChange?: (tags: SelectOption[]) => void;
	suggestions?: SelectOption[];
}

const TagInputField = forwardRef<HTMLInputElement, TagInputFieldProps>(
	(
		{
			label,
			name,
			id,
			className,
			error,
			helperText,
			placeholder,
			value = [],
			onChange,
			suggestions = [],
		},
		ref
	) => {
		const [input, setInput] = useState('');
		const [showSuggestions, setShowSuggestions] = useState(false);
		const wrapperRef = useRef<HTMLDivElement>(null);

		const filteredSuggestions = suggestions.filter(
			opt =>
				opt.label.toLowerCase().includes(input.toLowerCase()) &&
				!value.find(v => v.value === opt.value)
		);

		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
				e.preventDefault();
				const formattedInput = input.trim();
				const matchingOption = suggestions.find(
					opt => opt.label.toLowerCase() === formattedInput.toLowerCase()
				);
				if (matchingOption && !value.find(v => v.value === matchingOption.value)) {
					onChange?.([...value, matchingOption]);
				} else if (!matchingOption) {
					// If free text is allowed, you can optionally add:
					// const newOption = { label: formattedInput, value: formattedInput };
					// onChange?.([...value, newOption]);
				}
				setInput('');
				setShowSuggestions(false);
			}
		};

		const removeTag = (index: number) => {
			const newTags = value.filter((_, i) => i !== index);
			onChange?.(newTags);
		};


		const handleSuggestionClick = (selected: SelectOption) => {
			if (!value.find(v => v.value === selected.value)) {
				onChange?.([...value, selected]);
			}
			setInput('');
			setShowSuggestions(false);
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		useEffect(() => {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, []);

		return (
			<div className="w-full relative" ref={wrapperRef}>
				<fieldset
					className={`relative w-full border rounded-md px-3 pt-2 pb-2 text-primary-black focus-within:border-1 focus-within:border-primary-black ${error ? 'border-red-500' : 'border-neutral-200'
						}`}
				>
					<legend className="absolute left-2 transition-all px-1 text-form-input -top-3 bg-white">
						{label}
					</legend>

					<div className="flex flex-wrap items-center gap-2">
						{value.map((val, index) =>
							<span
								key={index}
								className="px-2 py-1 bg-neutral-200 text-sm rounded flex items-center gap-1"
							>
								{val.label}
								<button
									type="button"
									onClick={() => removeTag(index)}
									className="text-red-600 font-bold"
								>
									×
								</button>
							</span>
						)}

						<input
							ref={ref}
							type="text"
							name={name}
							id={id}
							className={`flex-1 min-w-[120px] outline-none border-none bg-transparent text-base py-1 ${className}`}
							placeholder={placeholder}
							value={input}
							onChange={e => {
								setInput(e.target.value);
								setShowSuggestions(true);
							}}
							onFocus={() => setShowSuggestions(true)}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</fieldset>

				{/* Suggestions Dropdown */}
				{showSuggestions && filteredSuggestions.length > 0 && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-md max-h-48 overflow-y-auto">
						{filteredSuggestions.map((option, index) => (
							<div
								key={index}
								onClick={() => handleSuggestionClick(option)}
								className="cursor-pointer px-3 py-2 hover:bg-neutral-100 text-sm"
							>
								{option.label}
							</div>
						))}
					</div>
				)}

				{error && <p className="mt-1 text-red-500 text-xs">{error}</p>}

				{helperText && !error && (
					<p className="mt-1 mx-2 text-xs text-neutral-600">
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

export default TagInputField;
