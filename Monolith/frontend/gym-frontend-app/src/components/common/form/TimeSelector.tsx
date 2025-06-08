type TimeSlotSelectorProps = {
	date: string;
	timeSlots: string[];
	selectedSlot: string | null;
	onSlotSelect: (slot: string) => void;
};

// Usage example
{
	/* <TimeSlotSelector 
    date="July 3" 
    timeSlots={[
        "8:00 - 9:00 AM",
        "9:00 - 10:00 AM",
        "10:00 - 11:00 AM",
        "3:00 - 4:00 PM",
        "4:00 - 5:00 PM",
        "5:00 - 6:00 PM",
        "6:00 - 7:00 PM",
        "7:00 - 8:00 PM",
    ]}
    selectedSlot={selectedTimeSlot}
    onSlotSelect={handleTimeSlotSelect}
/> */
}

const TimeSlotSelector = ({
	date,
	timeSlots,
	selectedSlot,
	onSlotSelect,
}: TimeSlotSelectorProps) => {
	const handleSlotSelect = (slot: string) => {
		onSlotSelect(slot);
	};

	return (
		<section className="w-full space-y-5 pt-8">
			{/* Date & Available Slots */}
			<div className="flex justify-between items-center text-sm">
				<p className="font-medium text-primary-black">{date}</p>
				<p className="text-neutral-600 font-light">
					{timeSlots.length} slots available
				</p>
			</div>

			{/* Scrollable Slot List */}
			<div className="overflow-y-auto space-y-2 scrollbar-hide">
				<hr className="text-neutral-400" />
				{timeSlots.map(slot => (
					<button
						key={slot}
						onClick={() => handleSlotSelect(slot)}
						className={`w-full py-3 text-center rounded-lg border-[1.5px] transition ${
							selectedSlot === slot
								? 'border-primary-green bg-green-100'
								: 'border-neutral-200 bg-green-100 hover:border-primary-green'
						}`}
					>
						{slot}
					</button>
				))}
			</div>
		</section>
	);
};

export default TimeSlotSelector;
