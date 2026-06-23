import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '../api/usersApi';
import { adminApi } from '../api/adminApi';

export function useUsersList(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await usersApi.getAll(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    },
  });
}

export function useSetUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => usersApi.setActive(id, isActive),
    onSuccess: (_, variables) => {
      toast.success(variables.isActive ? 'User activated' : 'User deactivated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update user status');
    },
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => adminApi.createAgent(payload),
    onSuccess: () => {
      toast.success('Agent account created');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create agent');
    },
  });
}