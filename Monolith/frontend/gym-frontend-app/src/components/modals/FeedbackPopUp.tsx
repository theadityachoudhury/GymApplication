import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTrigger,
} from '@/components/common/ui/alert-dialog';
import { X, Star } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/ui/CustomButton';

interface FeedbackDialogProps {
	trigger: React.ReactNode;
	onSubmit?: (rating: number, comment: string) => void;
	children: React.ReactNode; // 👈 Coach Info passed as children
}

export function FeedbackDialog({
	trigger,
	onSubmit,
	children,
}: FeedbackDialogProps) {
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	const handleSubmit = () => {
		onSubmit?.(rating, comment);
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<div onClick={() => setOpen(true)}>{trigger}</div>
			</AlertDialogTrigger>

			<AlertDialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white p-6 shadow-xl">
				{/* Close Button */}
				<button
					className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
					onClick={handleCancel}
					aria-label="Close"
				>
					<X className="h-4 w-4 text-gray-600" />
				</button>

				{/* Header */}
				<AlertDialogHeader className="text-center">
					<AlertDialogTitle className="text-2xl font-bold text-gray-900">
						Workout feedback
					</AlertDialogTitle>
					<AlertDialogDescription className="mt-2 text-gray-500">
						Please rate your experience below
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Coach Info (children) */}
				<div className="mt-6">{children}</div>

				{/* Stars */}
				<div className="mt-6 flex items-center justify-center gap-2">
					{[1, 2, 3, 4, 5].map(i => (
						<Star
							key={i}
							className={`h-8 w-8 cursor-pointer ${
								i <= rating
									? 'text-yellow-400 fill-yellow-400'
									: 'text-gray-300'
							}`}
							onClick={() => setRating(i)}
						/>
					))}
					<span className="ml-2 text-sm text-gray-600">
						{rating}/5 stars
					</span>
				</div>

				{/* Comment Box */}
				<textarea
					className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
					placeholder="Add your comments"
					value={comment}
					onChange={e => setComment(e.target.value)}
					rows={4}
				/>

				{/* Submit Button */}
				<AlertDialogFooter className="mt-6">
					<Button
						className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 rounded-lg"
						onClick={handleSubmit}
					>
						Submit Feedback
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
