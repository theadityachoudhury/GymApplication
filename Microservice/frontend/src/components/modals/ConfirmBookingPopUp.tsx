import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTrigger,
} from '@/components/common/ui/alert-dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/ui/CustomButton';

interface ConfirmBookingDialogProps {
	trigger: React.ReactNode;
	onConfirm?: () => void;
	onCancel?: () => void;
	children: React.ReactNode;
}

export function ConfirmBookingDialog({
	trigger,
	onConfirm,
	onCancel,
	children,
}: ConfirmBookingDialogProps) {
	const [open, setOpen] = useState(false);

	const handleCancel = () => {
		onCancel?.();
		setOpen(false);
	};

	const handleConfirm = () => {
		onConfirm?.();
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
						Confirm your booking
					</AlertDialogTitle>
					<AlertDialogDescription className="mt-2 text-gray-500">
						Please double-check your workout details.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Coach Info */}
				<div className="mt-6">{children}</div>

				{/* Footer */}
				<AlertDialogFooter className="mt-6">
					<Button
						className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 rounded-lg"
						onClick={handleConfirm}
					>
						Confirm
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
