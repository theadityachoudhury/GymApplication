import { ProfileUpdateService, CoachProfileUpdateData, AdminProfileUpdateData } from '@/services/profile-update.service';
import { logger } from '@/services/logger.service';
import HttpError from '@/utils/http-error';
import { z } from 'zod';
import mongoose, { Types } from 'mongoose';
import { WorkoutService } from '@/services/workout.service';
import { UserService } from '@/services/user.service';

// Schema for client profile update validation
const clientProfileUpdateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    image: z.string().optional(),
    target: z.string().min(1, 'Target is required').optional(),
    preferredActivity: z.string().min(1, 'Preferred activity is required').optional()
});

// Schema for coach profile update validation
const coachProfileUpdateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    image: z.string().optional(),
    title: z.string().optional(),
    about: z.string().optional(),
    specialization: z.array(z.string()).optional(),
    certificates: z.array(z.string()).optional(),
    workingDays: z.array(z.string()).optional()
});

// Schema for admin profile update validation
const adminProfileUpdateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    image: z.string().optional(),
    phoneNumber: z.string().optional()
});

export class ProfileUpdateController {
    private profileUpdateService: ProfileUpdateService;

    constructor() {
        this.profileUpdateService = new ProfileUpdateService();
    }

    /**
     * Update client profile
     */
    async updateClientProfile(cognitoId: string, body: unknown): Promise<any> {
        try {
            logger.info('Processing client profile update request', { cognitoId });

            // Validate request body
            const validatedData = clientProfileUpdateSchema.parse(body);

            // Update profile
            const updatedProfile = await this.profileUpdateService.updateClientProfile(cognitoId, validatedData);

            logger.info('Client profile updated successfully', { cognitoId });

            return updatedProfile;
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Client profile validation failed', { errors: error.errors });
                throw new HttpError(400, 'Validation failed', error.errors);
            }

            if (error instanceof HttpError) {
                throw error;
            }

            logger.error('Unexpected error during client profile update', error as Error);
            throw new HttpError(500, 'Failed to update client profile');
        }
    }

    /**
     * Update coach profile
     */
    async updateCoachProfile(cognitoId: string, id: string, body: unknown): Promise<any> {
        try {
            logger.info('Processing coach profile update request', { id });
            logger.info('body:', body as Record<string, any>)
            // Validate request body
            const validatedData = coachProfileUpdateSchema.parse(body);

            logger.info("parsed validated data", validatedData)

            const workoutService = new WorkoutService()

            if (validatedData.specialization?.some(id => !Types.ObjectId.isValid(id))) {
                throw new HttpError(400, 'One or more specialization IDs are invalid');
            }

            if (validatedData.certificates?.some(id => !Types.ObjectId.isValid(id))) {
                throw new HttpError(400, 'One or more certificate IDs are invalid');
            }


            if (validatedData.specialization)
                await workoutService.createMappings(id, validatedData.specialization)

            // Update profile
            const updatedProfile = await this.profileUpdateService.updateCoachProfile(cognitoId, {
                ...validatedData,
                specialization: validatedData.specialization
                    ? validatedData.specialization
                        .filter(Types.ObjectId.isValid)
                        .map(id => new Types.ObjectId(id))
                    : undefined,
                certificates: validatedData.certificates
                    ? validatedData.certificates
                        .filter(Types.ObjectId.isValid)
                        .map(id => new Types.ObjectId(id))
                    : undefined,
            });



            logger.info('Coach profile updated successfully', { cognitoId });

            return updatedProfile;
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Coach profile validation failed', { errors: error.errors });
                throw new HttpError(400, 'Validation failed', error.errors);
            }



            if (error instanceof HttpError) {
                throw error;
            }

            logger.error('Unexpected error during coach profile update', error as Error);
            throw new HttpError(500, 'Failed to update coach profile');
        }
    }

    /**
     * Update admin profile
     */
    async updateAdminProfile(cognitoId: string, body: unknown): Promise<any> {
        try {
            logger.info('Processing admin profile update request', { cognitoId });

            // Validate request body
            const validatedData = adminProfileUpdateSchema.parse(body);

            // Update profile
            const updatedProfile = await this.profileUpdateService.updateAdminProfile(cognitoId, validatedData);

            logger.info('Admin profile updated successfully', { cognitoId });

            return updatedProfile;
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Admin profile validation failed', { errors: error.errors });
                throw new HttpError(400, 'Validation failed', error.errors);
            }

            if (error instanceof HttpError) {
                throw error;
            }

            logger.error('Unexpected error during admin profile update', error as Error);
            throw new HttpError(500, 'Failed to update admin profile');
        }
    }


}