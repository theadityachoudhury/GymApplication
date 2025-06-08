import { toast } from 'react-hot-toast';
import SuccessIcon from '../assets/icons/success-icon.svg';
import ErrorIcon from '../assets/icons/error-icon.svg';
import CloseIcon from '../assets/icons/close-icon.svg';

interface ToastProps {
	type: 'success' | 'error';
	title: string;
	description: string;
}

const useToast = () => {
	const showToast = ({ type, title, description }: ToastProps) => {
		toast.custom(
			t => (
				<div
					className={`relative flex items-center justify-between p-4 rounded-lg shadow-md border-2 ${
						type === 'success'
							? 'border-green-700 bg-green-50'
							: 'border-red-700 bg-red-50'
					}`}
					style={{ minHeight: '70px' }}
				>
					{/* Icon */}
					<img
						src={type === 'success' ? SuccessIcon : ErrorIcon}
						alt={type}
						className="w-6 h-6 flex-shrink-0"
					/>

					{/* Content (Title + Description) */}
					<div className="flex-1 ml-3 overflow-hidden">
						<p className="text-sm font-semibold">{title}</p>
						<p className="text-sm text-gray-800">{description}</p>
					</div>

					{/* Close Button */}
					<button
						className="absolute top-2 right-2"
						onClick={() => toast.remove(t.id)}
					>
						<img
							src={CloseIcon}
							alt="Close"
							className="w-4 h-4 cursor-pointer"
						/>
					</button>
				</div>
			),
			{
				position: 'top-center',
				duration: 5000,
			}
		);
	};

	return { showToast };
};

export default useToast;
