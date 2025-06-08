import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/common/ui/alert-dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/ui/CustomButton';

interface AlertDialogProps {
	title: string;
	description: string;
	trigger: React.ReactNode;
	onConfirm?: () => void;
	onCancel?: () => void;
	confirmText?: string;
	cancelText?: string;
}

export function CustomAlertDialog({
	title,
	description,
	trigger,
	onConfirm,
	onCancel,
	confirmText = 'Continue',
	cancelText = 'Cancel',
}: AlertDialogProps) {
	const [open, setOpen] = useState(false);

	const handleCancel = () => {
		onCancel?.();
		setOpen(false);
	};

	const handleConfirm = () => {
		onConfirm?.();
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<div onClick={() => setOpen(true)}>{trigger}</div>
			</AlertDialogTrigger>

			<AlertDialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-background p-6 shadow-lg">
				{/* X Button at Top-Right */}
				<button
					className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
					onClick={handleClose}
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>

				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					{/* <AlertDialogCancel> */}
					<div>
						<Button
							variant="outline"
							size="small"
							onClick={handleCancel}
							className="hover:bg-semantic-red hover:text-white"
						>
							{cancelText}
						</Button>
					</div>

					{/* <AlertDialogAction> */}
					<div>
						<Button
							variant="primary"
							size="small"
							onClick={handleConfirm}
						>
							{confirmText}
						</Button>
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
