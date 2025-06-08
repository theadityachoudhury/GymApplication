import { ImageUploadService } from '@/services/image-upload.service';
import { User } from '@/models/user.model';
import { logger } from '@/services/logger.service';
import HttpError from '@/utils/http-error';
import { z } from 'zod';
import { ObjectId } from 'mongoose';

// Schema for image upload validation
const imageUploadSchema = z.object({
    image: z.string().min(1, 'Image is required')
});

export class ImageUploadController {
    private imageUploadService: ImageUploadService;

    constructor() {
        this.imageUploadService = new ImageUploadService();
    }

    /**
     * Upload profile image and update user record
     */
    async uploadProfileImage(cognitoId: string, body: unknown): Promise<{ imageUrl: string }> {
        try {
            logger.info('Processing profile image upload request', { cognitoId });

            // Validate request body
            const validatedData = imageUploadSchema.parse(body);

            // Find the user
            const user = await User.findOne({ cognitoId });

            if (!user) {
                logger.warn('User not found', { cognitoId });
                throw new HttpError(404, 'User not found');
            }

            // Check if the image is a base64 string
            if (!validatedData.image.startsWith('data:image')) {
                logger.warn('Invalid image format', { cognitoId });
                throw new HttpError(400, 'Invalid image format. Please provide a valid base64 encoded image.');
            }

            // Upload the image
            const imageUrl = await this.imageUploadService.uploadProfileImage(
                validatedData.image,
                user.role,
                (user._id as ObjectId).toString()
            );

            // Update the user's image field
            await User.updateOne(
                { _id: user._id },
                { $set: { image: imageUrl } }
            );

            logger.info('Profile image updated successfully', { cognitoId, imageUrl });

            return { imageUrl };
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Image upload validation failed', { errors: error.errors });
                throw new HttpError(400, 'Validation failed', error.errors);
            }

            if (error instanceof HttpError) {
                throw error;
            }

            logger.error('Unexpected error during image upload', error as Error);
            throw new HttpError(500, 'Failed to upload image');
        }
    }
}