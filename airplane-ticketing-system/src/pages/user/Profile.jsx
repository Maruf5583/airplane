import { useState, useEffect } from 'react';
import { User, Phone, Image, BookText, Save } from 'lucide-react';
import { useProfile, useUpdateProfile, useUpdatePassport } from '../../hooks/useProfile';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassport = useUpdatePassport();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePictureUrl: '',
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
        profilePictureUrl: profile.profilePictureUrl || '',
      });
    }
  }, [profile]);

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
          {profile.firstName?.charAt(0)}
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

        <Input
          label="Profile Picture URL"
          icon={Image}
          placeholder="https://..."
          value={profileForm.profilePictureUrl}
          onChange={(e) => setProfileForm({ ...profileForm, profilePictureUrl: e.target.value })}
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
    </div>
  );
}