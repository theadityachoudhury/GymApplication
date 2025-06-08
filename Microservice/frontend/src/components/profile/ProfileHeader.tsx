import { getAuthState, useAppSelector } from '@/hooks/redux';
import { Camera, CircleUserRoundIcon, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Button from '../common/ui/CustomButton';
import { UserDetails } from '@/types/user/user.type';
import { useImageUpload } from '@/hooks/imageUpload';
import useToast from '@/hooks/useToast';

const ProfileHeader = () => {
  const { userDetail: user } = useAppSelector(getAuthState);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast()
  // Use our custom hook for image uploads
  const { isLoading, error, uploadImage } = useImageUpload({
    onSuccess: (imageUrl) => {
      setAvatarUrl(imageUrl);

      setShowAvatarPopup(false);
      showToast({
        type: 'success',
        title: 'Image Updated',
        description: 'Your profile Image has been successfully updated.',
      });

    }, onError(error) {
      console.log(error);
      showToast({
        type: 'error',
        title: 'Image Updated',
        description: 'Your profile Image Update failed.',
      });
    }

  });

  const handleAvatarClick = () => {
    setShowAvatarPopup(true);
  };

  const closePopup = () => {
    setShowAvatarPopup(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadImage(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (user && (user as UserDetails).image) {
      setAvatarUrl((user as UserDetails).image!);
    }
  }, [user]);

  return (
    <div className="flex items-center space-x-4 px-4 py-6">
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full border-2 border-white flex flex-col items-center justify-center relative cursor-pointer"
        onClick={handleAvatarClick}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <CircleUserRoundIcon className="w-10 h-10" />
        )}
        <div className="mt-2 flex items-center gap-1 text-gray-400 hover cursor-pointer">
          <span className="text-sm">Edit</span>
          <Camera className="w-4 h-4" />
        </div>
      </div>

      {/* User Info */}
      <div>
        <h2 className="text-lg font-semibold">
          {user?.firstName} {user?.lastName}{' '}
          <span className="font-normal/60">({user?.role.toUpperCase()})</span>
        </h2>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {/* Avatar Popup */}
      {showAvatarPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Profile Picture</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CircleUserRoundIcon className="w-20 h-20 text-gray-400" />
                )}
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {error}
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                size="medium"
                fullWidth
                onClick={triggerFileInput}
                disabled={isLoading || isUploading}
              >
                {isLoading || isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Camera size={16} className="mr-1" />
                    Upload from device
                  </span>
                )}
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-sm text-gray-500 text-center">
              Recommended: Square image, at least 200x200 pixels
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;