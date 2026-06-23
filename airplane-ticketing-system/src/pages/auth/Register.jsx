import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Calendar, Globe } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useRegister } from '../../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: '',
  });
  const [errors, setErrors] = useState({});
  const registerMutation = useRegister();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'Required';
    if (!form.lastName) newErrors.lastName = 'Required';
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password || form.password.length < 6)
      newErrors.password = 'At least 6 characters';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    registerMutation.mutate(form, {
      onError: (error) => {
        const backendErrors = error.response?.data?.errors;
        if (backendErrors) {
          const mapped = {};
          Object.keys(backendErrors).forEach((key) => {
            const fieldKey = key.charAt(0).toLowerCase() + key.slice(1);
            mapped[fieldKey] = backendErrors[key][0];
          });
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
      },
    });
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start booking flights in minutes">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            name="firstName"
            icon={User}
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Last name"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          name="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone number"
            name="phoneNumber"
            icon={Phone}
            placeholder="+1 555 000 0000"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <Input
            label="Date of birth"
            type="date"
            name="dateOfBirth"
            icon={Calendar}
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />
        </div>

        <Input
          label="Nationality"
          name="nationality"
          icon={Globe}
          placeholder="e.g. Bangladeshi"
          value={form.nationality}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}