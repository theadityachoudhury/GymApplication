import express from 'express';
import { asyncHandler } from '../utils/async-handler';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CertificateUploadController } from '../controllers/certificate-upload.controller';

const router = express.Router();
const imageUploadController = new CertificateUploadController();

/**
 * @route   POST /api/v1/images/profile
 * @desc    Upload profile image
 * @access  Private
 * @body    {image} - base64 encoded image
 * @requires Authentication
 */
router.post('/upload-urls',
    authMiddleware(),
    asyncHandler(imageUploadController.getUploadUrls.bind(imageUploadController))
);

export default router;