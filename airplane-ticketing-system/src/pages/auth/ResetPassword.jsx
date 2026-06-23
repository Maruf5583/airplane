import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useResetPassword } from '../../hooks/useAuth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const mutation = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    mutation.mutate(form);
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Choose a new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="New password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}