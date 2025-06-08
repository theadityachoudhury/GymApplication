import { apiClient } from "./api/axiosInstance";

export interface ImageUploadResponse {
    status: boolean;
    data?: { imageUrl: string };
    message?: string;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export class ImageUploadService {
    /**
     * Maximum allowed file size in bytes (5MB)
     */
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

    /**
     * Allowed image MIME types
     */
    private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];


    /**
     * Convert a file to base64
     * @param file - The image file to convert
     * @returns Promise resolving to base64 string
     */
    public convertToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert image to base64'));
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Validate an image file
     * @param file - The image file to validate
     * @returns Validation result with isValid flag and error message if invalid
     */
    public validateImage(file: File): ValidationResult {
        // Check if file exists
        if (!file) {
            return {
                isValid: false,
                error: 'No file selected'
            };
        }

        // Check file type
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
            };
        }

        // Check file size
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit.`
            };
        }

        return {
            isValid: true
        };
    }

    /**
     * Process an image file (validate and convert to base64)
     * @param file - The image file to process
     * @returns Promise resolving to object with base64 data or error
     */
    public async processImage(file: File): Promise<{ success: boolean; base64Data?: string; error?: string }> {
        // Validate the image
        const validation = this.validateImage(file);

        if (!validation.isValid) {
            return {
                success: false,
                error: validation.error
            };
        }

        try {
            // Convert to base64
            const base64Data = await this.convertToBase64(file);

            return {
                success: true,
                base64Data
            };
        } catch (error: unknown) {
            console.log(error);
            return {
                success: false
            };
        }
    }

    /**
     * Upload an image to the backend
     * @param base64Image - Base64 encoded image
     * @param accessToken - JWT access token
     * @param userRole - User role for organizing images in storage
     * @returns Promise resolving to upload result
     */
    public async uploadImage(
        base64Image: string,
    ): Promise<ImageUploadResponse> {
        try {
            const response = await apiClient.axios.post("/manage/images/profile", { image: base64Image })

            return {
                status: true,
                data: {
                    imageUrl: response.data.data.imageUrl
                }
            }
        } catch (error) {
            return {
                status: false,
                message: error instanceof Error ? error.message : 'Failed to upload image'
            };
        }
    }

    /**
     * Process and upload an image in one step
     * @param file - The image file to upload
     * @param accessToken - JWT access token
     * @param userRole - User role for organizing images in storage
     * @returns Promise resolving to upload result
     */
    public async processAndUploadImage(
        file: File,
    ): Promise<ImageUploadResponse> {
        // First process the image
        const processResult = await this.processImage(file);

        if (!processResult.success || !processResult.base64Data) {
            return {
                status: false,
                message: processResult.error || 'Failed to process image'
            };
        }

        // Then upload the processed image
        return await this.uploadImage(processResult.base64Data);
    }
}

// Export a singleton instance
export const imageUploadService = new ImageUploadService();