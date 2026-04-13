'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { INITIATE_SIGN_UP } from '@/lib/graphql/mutations';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

// ── Icons ─────────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

// ── Icon input ─────────────────────────────────────────────────────────────

function IconInput({
  id, type = 'text', placeholder, value, onChange, autoComplete, icon, error,
}: {
  id: string; type?: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string; icon: React.ReactNode; error?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={[
          'w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder-outline font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
          error ? 'ring-2 ring-red-300 bg-red-50/50' : '',
        ].join(' ')}
      />
    </div>
  );
}

// ── Plain input (no icon, for names side-by-side) ──────────────────────────

function PlainInput({
  id, type = 'text', placeholder, value, onChange, autoComplete, error,
}: {
  id: string; type?: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string; error?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={[
        'w-full px-4 py-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder-outline font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
        error ? 'ring-2 ring-red-300 bg-red-50/50' : '',
      ].join(' ')}
    />
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const [initiateSignUp, { loading }] = useMutation<{ initiateSignUp: { status: string; message: string } }>(INITIATE_SIGN_UP);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      const { data } = await initiateSignUp({ variables: { input: form } });
      const result = data?.initiateSignUp;

      if (result?.status === 'otp_sent' || result?.status === 'guest_found') {
        if (result.status === 'guest_found') toast(result.message, 'info');
        sessionStorage.setItem('signup_email', form.email);
        if (result.status === 'otp_sent') sessionStorage.setItem('signup_new', 'true');
        router.push('/verify-otp');
        return;
      }

      if (result?.status === 'already_exists' || result?.status === 'blacklisted') {
        setServerError(result.message);
        return;
      }

      setServerError(result?.message || 'Something went wrong. Please try again.');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Network error. Please try again.');
    }
  }

  function field(name: keyof typeof form) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [name]: e.target.value }));
        if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
      },
      error: !!errors[name],
    };
  }

  return (
    <>
      {/* Page title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Create Account</h1>
        <p className="text-on-surface-variant font-medium text-sm">Join Salon Bhagi today</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="block text-sm font-semibold text-on-surface-variant px-1">
              First name
            </label>
            <PlainInput id="firstName" placeholder="Jane" autoComplete="given-name" {...field('firstName')} />
            <FormError message={errors.firstName} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="block text-sm font-semibold text-on-surface-variant px-1">
              Last name
            </label>
            <PlainInput id="lastName" placeholder="Smith" autoComplete="family-name" {...field('lastName')} />
            <FormError message={errors.lastName} />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant px-1">
            Email Address
          </label>
          <IconInput
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            icon={<EnvelopeIcon />}
            {...field('email')}
          />
          <FormError message={errors.email} />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-semibold text-on-surface-variant px-1">
            Phone Number
          </label>
          <IconInput
            id="phone"
            type="tel"
            placeholder="+44 7700 000000"
            autoComplete="tel"
            icon={<PhoneIcon />}
            {...field('phone')}
          />
          <FormError message={errors.phone} />
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
            {serverError.toLowerCase().includes('already') && (
              <Link href="/sign-in" className="text-xs font-semibold text-red-600 underline mt-1 block">
                Go to sign in →
              </Link>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tertiary text-white font-bold py-4 rounded-full shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 font-headline text-base mt-2"
        >
          {loading ? 'Please wait…' : 'Continue'}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
          Sign In
        </Link>
      </p>
    </>
  );
}
