import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '../api/usersApi';
import { useAuthContext } from '../context/AuthContext';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await usersApi.getProfile();
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUserInStorage } = useAuthContext();

  return useMutation({
    mutationFn: (payload) => usersApi.updateProfile(payload),
    onSuccess: (response) => {
      toast.success('Profile updated successfully');
      updateUserInStorage(response.data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    },
  });
}

export function useUpdatePassport() {
  return useMutation({
    mutationFn: (payload) => usersApi.updatePassport(payload),
    onSuccess: () => {
      toast.success('Passport details updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update passport');
    },
  });
}