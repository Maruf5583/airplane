import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForgotPassword } from '../../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    mutation.mutate(email, { onSuccess: () => setSent(true) });
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {sent ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
          Check your inbox — if that email exists in our system, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            Send Reset Link
          </Button>
        </form>
      )}

      <Link
        to="/login"
        className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-6"
      >
        <ArrowLeft size={14} />
        Back to login
      </Link>
    </AuthLayout>
  );
}