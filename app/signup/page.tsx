'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // 'ba' or 'client'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; role?: string }>({});

  const validate = () => {
    const newErrors: any = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (fullName.length > 256) newErrors.fullName = 'Full name cannot exceed 256 characters';

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (email.length > 256) newErrors.email = 'Email cannot exceed 256 characters';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!['ba', 'client'].includes(role)) newErrors.role = 'Role must be BA or Client';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.detail?.toLowerCase().includes('email')) {
          setErrors({ email: data.detail });
        } else {
          alert(data.detail || 'Signup failed');
        }
        return;
      }

      // ✅ Show success alert, then redirect
      alert('Registration successful! Redirecting to login...');
      router.push('/login');
    } catch (err: any) {
      alert(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        {/* Full Name */}
        <Input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setErrors((prev) => ({ ...prev, fullName: '' }));
          }}
          required
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

        {/* Email */}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Password */}
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          required
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        {/* Role Dropdown */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setErrors((prev) => ({ ...prev, role: '' }));
          }}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="ba">BA</option>
          <option value="client">Client</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Account'}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
