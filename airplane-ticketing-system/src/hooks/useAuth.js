import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';

export function useAuth() {
  return useAuthContext();
}

export function useLogin() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.fullName || 'there'}!`);
      if (user.role === 'Admin') navigate('/admin/dashboard');
      else if (user.role === 'Agent') navigate('/agent/dashboard');
      else navigate('/');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.title ||
        'Invalid email or password';
      toast.error(message);
    },
  });
}

export function useRegister() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => register(payload),
    onSuccess: () => {
      toast.success('Account created! Please verify your email.');
      navigate('/');
    },
    onError: (error) => {
      const data = error.response?.data;
      const fieldErrors = data?.errors;

      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstField = Object.keys(fieldErrors)[0];
        const firstMessage = fieldErrors[firstField]?.[0];
        toast.error(firstMessage || 'Please check the highlighted fields');
      } else {
        const message = data?.detail || data?.title || 'Registration failed. Please try again.';
        toast.error(message);
      }
    },
  });
}

export function useLogout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('If that email exists, a reset link has been sent.');
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 'Reset failed. The link may have expired.';
      toast.error(message);
    },
  });
}