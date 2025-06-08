// certificate-upload.controller.ts
import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpError } from '../utils/http-error';
import logger from '../config/logger';
import { CertificateUploadService } from '../services/certificate-upload.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';

// Schema for certificate upload request validation
const certificateUploadRequestSchema = z.object({
    fileNames: z.array(z.string()).min(1, 'At least one file name is required'),
    fileTypes: z.array(z.string()).min(1, 'At least one file type is required'),
    certificateType: z.string().min(1, 'Certificate type is required')
});

export class CertificateUploadController {
    private certificateUploadService: CertificateUploadService;

    constructor() {
        this.certificateUploadService = new CertificateUploadService();
    }

    /**
     * Generate pre-signed URLs for certificate uploads
     */
    async getUploadUrls(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('Processing certificate upload URL request');

            // Ensure user is authenticated
            if (!req.userId) {
                throw new HttpError(401, 'Authentication required');
            }

            // Validate request body
            let validatedData;
            try {
                validatedData = certificateUploadRequestSchema.parse(req.body);
            } catch (zodError) {
                if (zodError instanceof z.ZodError) {
                    const formattedErrors = zodError.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }));
                    throw new HttpError(400, 'Validation failed', formattedErrors);
                }
                throw zodError;
            }

            // Check if arrays have the same length
            if (validatedData.fileNames.length !== validatedData.fileTypes.length) {
                throw new HttpError(400, 'File names and file types arrays must have the same length');
            }

            // Find the user
            const user = await User.findById(req.userId);

            if (!user) {
                logger.warn('User not found', { userId: req.userId });
                throw new HttpError(404, 'User not found');
            }

            // Generate pre-signed URLs
            const uploadUrls = await this.certificateUploadService.generateUploadUrls(
                validatedData.fileNames,
                validatedData.fileTypes,
                validatedData.certificateType,
                user.role,
                req.userId
            );

            logger.info('Certificate upload URLs generated successfully', { userId: req.userId });

            res.status(200).json({
                status: 'success',
                message: 'Certificate upload URLs generated successfully',
                data: { uploadUrls }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Save certificate references after successful upload
     */
    async saveCertificates(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('Processing certificate save request');

            // Ensure user is authenticated
            if (!req.userId) {
                throw new HttpError(401, 'Authentication required');
            }

            const { certificateUrls, certificateType } = req.body;

            if (!certificateUrls || !Array.isArray(certificateUrls) || certificateUrls.length === 0) {
                throw new HttpError(400, 'Certificate URLs are required');
            }

            if (!certificateType) {
                throw new HttpError(400, 'Certificate type is required');
            }

            // Find the user
            const user = await User.findById(req.userId);

            if (!user) {
                logger.warn('User not found', { userId: req.userId });
                throw new HttpError(404, 'User not found');
            }

            // Update user's certificates
            // Note: You'll need to adjust this based on your User model structure
            // This is just an example assuming certificates are stored in an array
            await User.updateOne(
                { _id: user._id },
                {
                    $push: {
                        certificates: {
                            type: certificateType,
                            urls: certificateUrls,
                            uploadedAt: new Date()
                        }
                    }
                }
            );

            logger.info('Certificates saved successfully', { userId: req.userId });

            res.status(200).json({
                status: 'success',
                message: 'Certificates saved successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}