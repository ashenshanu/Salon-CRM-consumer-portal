'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { REQUEST_PASSWORD_RESET } from '@/lib/graphql/mutations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Valid email is required');
      return;
    }
    setEmailError('');

    try {
      await requestReset({ variables: { email } });
      setSent(true);
    } catch {
      // Always show success to avoid email enumeration
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 text-xl mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Check your email</h1>
        <p className="text-sm text-stone-500 mb-6">
          If an account exists for <span className="font-medium text-stone-700">{email}</span>,
          we&apos;ve sent a password reset link. It expires in 15 minutes.
        </p>
        <Link href="/sign-in">
          <Button variant="secondary" fullWidth>Back to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Reset your password</h1>
      <p className="text-sm text-stone-500 mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="email" required>Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            error={!!emailError}
          />
          <FormError message={emailError} />
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Send Reset Link
        </Button>

        <Link href="/sign-in">
          <Button variant="ghost" fullWidth>Back to Sign In</Button>
        </Link>
      </form>
    </div>
  );
}
