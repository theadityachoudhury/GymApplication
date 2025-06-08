// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { coachesType, TimeSlots } from '../types/coaches.type';
import Kristin from '../assets/Coaches/Kristin.svg';
import Wade from '../assets/Coaches/Wade.svg';
import Cameron from '../assets/Coaches/Cameron.svg';
import Jenny from '../assets/Coaches/Jenny.svg';
import Jacob from '../assets/Coaches/Jacob.svg';
import Guy from '../assets/Coaches/Guy.svg';
import Brooklyn from '../assets/Coaches/Brooklyn.svg';
import Bessie from '../assets/Coaches/Bessie.svg';

export const coachesDetailedData = [
	{
		id: '582846d5c951184d705b65d1',
		name: 'Kristin Watson',
		image: Kristin,
		title: 'Certified Personal Yoga Trainer',
		rating: 4.96,
		about: 'Kristin has over 12 years of experience teaching yoga to clients of all levels. Her approach combines traditional yoga practices with modern fitness techniques to create balanced, effective routines that improve both physical and mental wellbeing.',
		specializations: ['Yoga', 'Flexibility', 'Meditation', 'Mindfulness'],
		certificates: [
			{
				name: 'Yoga Alliance 500-Hour Certification.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Mindfulness-Based Stress Reduction (MBSR) Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: "Master's in Exercise Physiology, University of Washington",
		experience: '12+ years teaching yoga in studio and private settings',
		languages: ['English', 'Spanish'],
	},

	{
		id: '582846d5c951184d705b65d2',
		name: 'Wade Warren',
		image: Wade,
		title: 'Professional Strength Coach',
		rating: 4.85,
		about: 'Michael specializes in strength and conditioning with 8 years of experience working with both amateur athletes and fitness enthusiasts. His evidence-based approach focuses on progressive overload and proper form to maximize results while minimizing injury risk.',
		specializations: [
			'Weights',
			'Strength',
			'Powerlifting',
			'Muscle Building',
		],
		certificates: [
			{
				name: 'National Strength and Conditioning Association (NSCA) Certification.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'USA Weightlifting Level 2 Coach Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'B.S. in Kinesiology, Ohio State University',
		experience:
			'Former collegiate athlete with 8 years professional coaching experience',
		languages: ['English'],
	},

	{
		id: '582846d5c951184d705b65d3',
		name: 'Cameron Williamson',
		image: Cameron,
		title: 'Certified Pilates Instructor',
		rating: 4.92,
		about: "Sarah has dedicated the past 10 years to mastering and teaching Pilates. Her specialized approach focuses on core strength, posture correction, and rehabilitation. She's particularly skilled at adapting exercises for clients with injuries or physical limitations.",
		specializations: [
			'Pilates',
			'Flexibility',
			'Core Strength',
			'Rehabilitation',
		],
		certificates: [
			{
				name: 'Comprehensive Pilates Certification (BASI Pilates).pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Pilates for Rehabilitation Specialist Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'B.A. in Dance, Juilliard School',
		experience:
			'Former professional dancer with 10 years teaching experience',
		languages: ['English', 'French'],
	},

	{
		id: '582846d5c951184d705b65d4',
		name: 'Jenny Wilson',
		image: Jenny,
		title: 'Experienced Cardio Trainer',
		rating: 4.78,
		about: 'Robert is a cardio and endurance specialist with 15 years of experience coaching runners and endurance athletes. His training programs are designed to progressively build cardiovascular capacity while improving technique to prevent injuries and enhance performance.',
		specializations: ['Cardio', 'Running', 'Endurance', 'General Fitness'],
		certificates: [
			{
				name: 'American College of Sports Medicine (ACSM) Certified Personal Trainer.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'USA Track & Field Level 2 Coach Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'M.S. in Exercise Science, University of Oregon',
		experience: 'Former marathon runner with 15 years coaching experience',
		languages: ['English', 'Mandarin'],
	},

	{
		id: '582846d5c951184d705b65d5',
		name: 'Jacob Jones',
		image: Jacob,
		title: 'Weight Management Specialist',
		rating: 4.89,
		about: 'Jessica combines nutrition knowledge with effective training protocols to help clients achieve sustainable weight management. With 9 years of experience, she specializes in creating holistic programs that address both exercise and dietary habits for long-term success.',
		specializations: [
			'Weight Training',
			'Cardio',
			'Nutrition',
			'Weight Management',
		],
		certificates: [
			{
				name: 'National Academy of Sports Medicine (NASM) Certified Personal Trainer.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Precision Nutrition Level 2 Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'B.S. in Nutrition Science, Cornell University',
		experience:
			'9 years specializing in weight management and transformation',
		languages: ['English', 'Portuguese'],
	},
	{
		id: '582846d5c951184d705b65d6',
		name: 'Guy Hawkins',
		image: Guy,
		title: 'Functional Fitness Specialist',
		rating: 4.89,
		about: 'Guy focuses on functional fitness, designing exercise programs that mimic real-life movements to improve strength, balance, and flexibility. He has 7 years of experience helping clients enhance performance for daily activities and sports.',
		specializations: [
			'Functional Fitness',
			'Weights',
			'Cardio',
			'Mobility',
		],
		certificates: [
			{
				name: 'Functional Movement Systems (FMS) Certification.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Certified Strength and Conditioning Specialist (CSCS).pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'B.S. in Sports Science, University of Michigan',
		experience:
			'7 years specializing in functional training and strength conditioning',
		languages: ['English'],
	},
	{
		id: '582846d5c951184d705b65d7',
		name: 'Brooklyn Simmons',
		image: Brooklyn,
		title: 'General Fitness and Cardio Coach',
		rating: 5.0,
		about: 'Brooklyn is dedicated to helping clients achieve overall fitness and endurance. With 6 years of experience, she creates personalized programs that balance cardio and strength training for optimal results.',
		specializations: [
			'Cardio',
			'General Fitness',
			'Endurance',
			'Personal Training',
		],
		certificates: [
			{
				name: 'Certified Personal Trainer (CPT) by NASM.pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Cardio Fitness Specialist Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education:
			'B.S. in Health and Human Performance, University of Florida',
		experience: '6 years coaching general fitness and endurance training',
		languages: ['English'],
	},
	{
		id: '582846d5c951184d705b65d8',
		name: 'Bessie Cooper',
		image: Bessie,
		title: 'Yoga and Flexibility Coach',
		rating: 4.89,
		about: 'Bessie is a yoga and flexibility expert with 8 years of experience helping clients improve mobility, balance, and mental clarity. She specializes in creating customized yoga programs that blend physical fitness with mindfulness techniques.',
		specializations: ['Yoga', 'Flexibility', 'Mobility', 'Mindfulness'],
		certificates: [
			{
				name: 'Certified Yoga Instructor (RYT-500).pdf',
				url: 'certificate.pdf',
			},
			{
				name: 'Advanced Flexibility Training Certification.pdf',
				url: 'certificate.pdf',
			},
		],
		education: 'Diploma in Yoga Studies, Himalayan Institute',
		experience: '8 years teaching yoga and flexibility training',
		languages: ['English', 'Hindi'],
	},
];
export const coaches: coachesType[] = [
	{
		id: '582846d5c951184d705b65d1',
		imageUrl: Kristin,
		motivationPitch:
			'A Yoga Expert dedicated to crafting personalized workout plans that align with your goals.',
		name: 'Kristin Watson',
		rating: 4.96,
		summary: 'Certified personal yoga trainer',
		specializations: ['YOGA', 'FLEXIBILITY'],
	},
	{
		id: '582846d5c951184d705b65d2',
		imageUrl: Wade,
		motivationPitch:
			'Strength training specialist with focus on building muscle and improving overall fitness.',
		name: 'Wade Warren',
		rating: 4.8,
		summary: 'Climbing Coach',
		specializations: ['WEIGHTS', 'STRENGTH'],
	},
	{
		id: '582846d5c951184d705b65d3',
		imageUrl: Cameron,
		motivationPitch:
			'Pilates instructor helping you improve core strength and flexibility.',
		name: 'Cameron Williamson',
		rating: 5.0,
		summary: 'Strength Coach',
		specializations: ['PILATES', 'FLEXIBILITY'],
	},
	{
		id: '582846d5c951184d705b65d4',
		imageUrl: Jenny,
		motivationPitch:
			'Cardio specialist focused on improving endurance and heart health.',
		name: 'Robert Chen',
		rating: 4.78,
		summary: 'Experienced cardio trainer',
		specializations: ['CARDIO', 'GENERAL_FITNESS'],
	},
	{
		id: '582846d5c951184d705b65d5',
		imageUrl: Jacob,
		motivationPitch:
			'Helping clients achieve their weight goals through personalized training.',
		name: 'Jessica Adams',
		rating: 4.89,
		summary: 'Weight management specialist',
		specializations: ['WEIGHTS', 'CARDIO'],
	},
	{
		id: '582846d5c951184d705b65d6',
		imageUrl: Guy,
		motivationPitch:
			'Transform your fitness with our Functional Fitness Trainer, who focuses on exercises that mimic real-life movements.',
		name: 'Guy Hawkins',
		rating: 4.89,
		summary: 'Weight management specialist',
		specializations: ['WEIGHTS', 'CARDIO'],
	},
	{
		id: '582846d5c951184d705b65d7',
		imageUrl: Brooklyn,
		motivationPitch:
			'Helping clients achieve their weight goals through personalized training.',
		name: 'Brooklyn Simmons',
		rating: 5.0,
		summary: 'Strength Coach',
		specializations: ['CARDIO', 'GENERAL_FITNESS'],
	},
	{
		id: '582846d5c951184d705b65d8',
		imageUrl: Bessie,
		motivationPitch:
			'Transform your fitness with our Functional Fitness Trainer, who focuses on exercises that mimic real-life movements.',
		name: 'Bessie Cooper',
		rating: 4.89,
		summary: 'Weight management specialist',
		specializations: ['YOGA', 'FLEXIBILITY'],
	},
];

export const coachAvailableTimeSlots: TimeSlots = {
	'582846d5c951184d705b65d1': {
		'2025-04-15': [
			'8:00-9:00 AM',
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'3:00-4:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-16': [
			'8:00-9:00 AM',
			'9:00-10:00 AM',
			'2:00-3:00 PM',
			'3:00-4:00 PM',
		],
		'2025-04-17': [
			'10:00-11:00 AM',
			'11:00-12:00 PM',
			'4:00-5:00 PM',
			'5:00-6:00 PM',
		],
	},
	'582846d5c951184d705b65d2': {
		'2025-04-15': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'2:00-3:00 PM',
			'5:00-6:00 PM',
		],
		'2025-04-16': [
			'8:00-9:00 AM',
			'11:00-12:00 PM',
			'3:00-4:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-17': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'1:00-2:00 PM',
			'5:00-6:00 PM',
		],
	},
	'582846d5c951184d705b65d3': {
		'2025-04-15': [
			'8:00-9:00 AM',
			'11:00-12:00 PM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-16': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'3:00-4:00 PM',
			'5:00-6:00 PM',
		],
		'2025-04-17': [
			'8:00-9:00 AM',
			'1:00-2:00 PM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
	},
	'582846d5c951184d705b65d4': {
		'2025-04-15': [
			'8:00-9:00 AM',
			'9:00-10:00 AM',
			'1:00-2:00 PM',
			'5:00-6:00 PM',
		],
		'2025-04-16': [
			'10:00-11:00 AM',
			'11:00-12:00 PM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-17': [
			'9:00-10:00 AM',
			'12:00-1:00 PM',
			'3:00-4:00 PM',
			'5:00-6:00 PM',
		],
	},
	'582846d5c951184d705b65d5': {
		'2025-04-15': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'3:00-4:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-16': [
			'8:00-9:00 AM',
			'10:00-11:00 AM',
			'1:00-2:00 PM',
			'5:00-6:00 PM',
		],
		'2025-04-17': [
			'11:00-12:00 PM',
			'12:00-1:00 PM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
	},
	'582846d5c951184d705b65d6': {
		'2025-04-15': [
			'8:00-9:00 AM',
			'9:00-10:00 AM',
			'1:00-2:00 PM',
			'2:00-3:00 PM',
		],
		'2025-04-16': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'3:00-4:00 PM',
			'5:00-6:00 PM',
		],
		'2025-04-17': [
			'8:00-9:00 AM',
			'11:00-12:00 PM',
			'1:00-2:00 PM',
			'4:00-5:00 PM',
		],
	},
	'582846d5c951184d705b65d7': {
		'2025-04-15': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-16': [
			'8:00-9:00 AM',
			'11:00-12:00 PM',
			'1:00-2:00 PM',
			'3:00-4:00 PM',
		],
		'2025-04-17': [
			'10:00-11:00 AM',
			'12:00-1:00 PM',
			'2:00-3:00 PM',
			'5:00-6:00 PM',
		],
	},
	'582846d5c951184d705b65d8': {
		'2025-04-15': [
			'8:00-9:00 AM',
			'10:00-11:00 AM',
			'1:00-2:00 PM',
			'3:00-4:00 PM',
		],
		'2025-04-16': [
			'9:00-10:00 AM',
			'10:00-11:00 AM',
			'2:00-3:00 PM',
			'4:00-5:00 PM',
		],
		'2025-04-17': [
			'9:00-10:00 AM',
			'11:00-12:00 PM',
			'1:00-2:00 PM',
			'3:00-4:00 PM',
		],
	},
};
