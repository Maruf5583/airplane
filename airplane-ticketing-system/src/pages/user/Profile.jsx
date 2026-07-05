import { useState, useEffect, useRef } from 'react';
import { User, Phone, BookText, Save, Camera, Loader2, Eye, X } from 'lucide-react';
import {
  useProfile,
  useUpdateProfile,
  useUpdatePassport,
  useUploadProfilePicture,
} from '../../hooks/useProfile';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// backend relative path (/uploads/...) হলে API base URL জোড়া লাগিয়ে দেয়
const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
};

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassport = useUpdatePassport();
  const uploadPicture = useUploadProfilePicture();

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [passportForm, setPassportForm] = useState({
    passportNumber: '',
    issuingCountry: '',
    issuedDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile]);

  // component unmount হলে local preview URL memory থেকে clean up
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // নতুন profile picture URL আসলে আগের broken/error state রিসেট
  useEffect(() => {
    setImgError(false);
  }, [profile?.profilePictureUrl]);

  // Esc চাপলে viewer বন্ধ হবে
  useEffect(() => {
    if (!isViewerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsViewerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen]);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(profileForm);
  };

  const handlePassportSubmit = (e) => {
    e.preventDefault();
    updatePassport.mutate(passportForm);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Only JPG, PNG, GIF or WEBP images are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must not exceed 5MB.');
      e.target.value = '';
      return;
    }

    // instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setImgError(false);

    uploadPicture.mutate(file, {
      onError: () => {
        setPreviewUrl(null);
      },
    });

    // একই file পুনরায় select করলে onChange fire হওয়ার জন্য reset
    e.target.value = '';
  };

  const displayImage = previewUrl || getFullImageUrl(profile.profilePictureUrl);
  const hasViewableImage = displayImage && !imgError;

  const handleViewClick = (e) => {
    e.stopPropagation();
    if (hasViewableImage) setIsViewerOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative group w-16 h-16">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold overflow-hidden">
            {hasViewableImage ? (
              <img
                src={displayImage}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{profile.firstName?.charAt(0)}</span>
            )}
          </div>

          {/* Hover overlay: upload (camera) + view (eye, শুধু image থাকলে) */}
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-2 transition-colors">
            {uploadPicture.isPending ? (
              <Loader2 size={16} className="text-white animate-spin" />
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change profile picture"
                >
                  <Camera size={16} />
                </button>
                {hasViewableImage && (
                  <button
                    type="button"
                    onClick={handleViewClick}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View profile picture"
                  >
                    <Eye size={16} />
                  </button>
                )}
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadPicture.isPending}
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-800">{profile.fullName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge status={profile.role} />
            {profile.isEmailVerified ? (
              <span className="text-xs text-emerald-600">Email verified</span>
            ) : (
              <span className="text-xs text-amber-600">Email not verified</span>
            )}
          </div>
          {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="card space-y-4">
        <h3 className="font-semibold text-slate-800">Personal Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={User}
            value={profileForm.firstName}
            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            value={profileForm.lastName}
            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
          />
        </div>

        <Input label="Email" value={profile.email} disabled containerClassName="opacity-60" />

        <Input
          label="Phone Number"
          icon={Phone}
          value={profileForm.phoneNumber}
          onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
        />

        <div className="flex justify-end">
          <Button type="submit" icon={Save} isLoading={updateProfile.isPending}>
            Save Changes
          </Button>
        </div>
      </form>

      <form onSubmit={handlePassportSubmit} className="card space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <BookText size={16} /> Passport Information
        </h3>

        <Input
          label="Passport Number"
          value={passportForm.passportNumber}
          onChange={(e) => setPassportForm({ ...passportForm, passportNumber: e.target.value })}
        />

        <Input
          label="Issuing Country"
          value={passportForm.issuingCountry}
          onChange={(e) => setPassportForm({ ...passportForm, issuingCountry: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Issued Date"
            type="date"
            value={passportForm.issuedDate}
            onChange={(e) => setPassportForm({ ...passportForm, issuedDate: e.target.value })}
          />
          <Input
            label="Expiry Date"
            type="date"
            value={passportForm.expiryDate}
            onChange={(e) => setPassportForm({ ...passportForm, expiryDate: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} isLoading={updatePassport.isPending}>
            Save Passport
          </Button>
        </div>
      </form>

      {/* Full-size profile picture viewer */}
      {isViewerOpen && hasViewableImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsViewerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-slate-300"
            title="Close"
          >
            <X size={28} />
          </button>
          <img
            src={displayImage}
            alt={profile.fullName}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}