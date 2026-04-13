'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { SIGN_IN } from '@/lib/graphql/mutations';
import { setSessionToken } from '@/lib/session';
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

function LockIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

// ── Input with icon ────────────────────────────────────────────────────────

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

// ── Form ───────────────────────────────────────────────────────────────────

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const redirect = params.get('redirect') || '/account';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const [signIn, { loading }] = useMutation<{ signIn: { token: string } }>(SIGN_IN);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      const { data } = await signIn({ variables: { email: form.email, password: form.password } });
      await setSessionToken(data!.signIn.token);
      toast('Welcome back!', 'success');
      router.push(redirect);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
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
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Welcome Back</h1>
        <p className="text-on-surface-variant font-medium text-sm">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant px-1">
            Email Address
          </label>
          <IconInput
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            icon={<PersonIcon />}
            {...field('email')}
          />
          <FormError message={errors.email} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="password" className="text-sm font-semibold text-on-surface-variant">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline underline-offset-4">
              Forgot Password?
            </Link>
          </div>
          <IconInput
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<LockIcon />}
            {...field('password')}
          />
          <FormError message={errors.password} />
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
          </div>
        )}

        {/* CTA — crimson pill button from login.html */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tertiary text-white font-bold py-4 rounded-full shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 font-headline text-base mt-2"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-container" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-outline font-medium">Or continue with</span>
        </div>
      </div>

      {/* Social buttons (UI placeholder) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-bold text-on-surface-variant">Google</span>
        </button>
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span className="text-sm font-bold text-on-surface-variant">Apple</span>
        </button>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
        New to Salon Bhagi?{' '}
        <Link href="/sign-up" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
          Create an Account
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
