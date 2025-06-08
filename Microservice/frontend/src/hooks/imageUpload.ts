import { useState } from 'react';
import { useAppSelector } from './redux';
import { getAuthState } from './redux';
import { ImageUploadResponse, imageUploadService } from '@/services/imageUpload.service';

interface UseImageUploadOptions {
    onSuccess?: (imageUrl: string) => void;
    onError?: (error: string) => void;
}

interface UseImageUploadResult {
    isLoading: boolean;
    error: string | null;
    uploadImage: (file: File) => Promise<string | null>;
    resetError: () => void;
}

export const useImageUpload = (options?: UseImageUploadOptions): UseImageUploadResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { token, userDetail } = useAppSelector(getAuthState);

    const resetError = () => setError(null);

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!token || !userDetail?.role) {
            const errorMessage = 'Authentication required';
            setError(errorMessage);
            if (options?.onError) options.onError(errorMessage);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: ImageUploadResponse = await imageUploadService.processAndUploadImage(
                file,
            );

            if (!result.status || !result.data) {
                throw new Error(result.message || 'Failed to upload image');
            }

            if (options?.onSuccess) {
                options.onSuccess(result.data.imageUrl);
            }

            return result.data.imageUrl;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
            setError(errorMessage);

            if (options?.onError) {
                options.onError(errorMessage);
            }

            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        uploadImage,
        resetError
    };
};