import React from 'react';
import welcomeStrip from '@/assets/welcomeStrip.svg';

interface WelcomeStripProps {
	customMessage?: string;
}

const WelcomeStrip: React.FC<WelcomeStripProps> = ({ customMessage }) => {
	return (
		<div className="bg-lime-500 py-6 relative overflow-hidden ">
			{/* Background SVG using img tag */}
			<div className="absolute inset-0 z-0 w-full h-full">
				<img
					src={welcomeStrip}
					alt="Background pattern"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Content */}
			<div className="text-white text-xl font-medium relative z-10 mx-4 sm:mx-8 md:mx-12">
				{customMessage}
			</div>
		</div>
	);
};

export default WelcomeStrip;
