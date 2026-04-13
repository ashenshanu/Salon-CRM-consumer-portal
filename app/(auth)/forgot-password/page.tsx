'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { REQUEST_PASSWORD_RESET } from '@/lib/graphql/mutations';
import FormError from '@/components/ui/FormError';

function EnvelopeIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

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
    } catch {
      // Always show success to avoid email enumeration
    }
    setSent(true);
  }

  if (sent) {
    return (
      <>
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light/60 mb-5">
            <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Check Your Email</h1>
          <p className="text-on-surface-variant font-medium text-sm">
            If an account exists for{' '}
            <span className="font-bold text-on-surface">{email}</span>,
            we&apos;ve sent a password reset link. It expires in 15 minutes.
          </p>
        </div>

        <Link
          href="/sign-in"
          className="flex items-center justify-center w-full py-3.5 rounded-full border-2 border-outline-variant text-on-surface-variant text-sm font-bold hover:border-primary hover:text-primary transition-all"
        >
          ← Back to Sign In
        </Link>
      </>
    );
  }

  return (
    <>
      {/* Page title */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Forgot Password?</h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant px-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"><EnvelopeIcon /></span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              className={[
                'w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder-outline font-medium',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                emailError ? 'ring-2 ring-red-300 bg-red-50/50' : '',
              ].join(' ')}
            />
          </div>
          <FormError message={emailError} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tertiary text-white font-bold py-4 rounded-full shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 font-headline text-base"
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>

        <Link
          href="/sign-in"
          className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          ← Back to Sign In
        </Link>
      </form>
    </>
  );
}
