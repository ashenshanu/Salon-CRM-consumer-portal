'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { SET_PASSWORD } from '@/lib/graphql/mutations';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

function LockIcon() {
  return (
    <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function IconInput({
  id, placeholder, value, onChange, error,
}: {
  id: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"><LockIcon /></span>
      <input
        id={id}
        type="password"
        autoComplete="new-password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          'w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder-outline font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
          error ? 'ring-2 ring-red-300 bg-red-50/50' : '',
        ].join(' ')}
      />
    </div>
  );
}

export default function SetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [setPassword, { loading }] = useMutation(SET_PASSWORD);

  function validate() {
    const errs: Record<string, string> = {};
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain at least one uppercase letter';
    else if (!/[a-z]/.test(form.password)) errs.password = 'Must contain at least one lowercase letter';
    else if (!/[0-9]/.test(form.password)) errs.password = 'Must contain at least one number';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      await setPassword({ variables: { password: form.password } });
      toast('Password set successfully!', 'success');
      router.push('/account');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to set password. Please try again.');
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
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary/10 mb-5">
          <svg className="h-8 w-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Set Your Password</h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Create a strong password to secure your account
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant px-1">
            New Password <span className="text-tertiary">*</span>
          </label>
          <IconInput id="password" placeholder="Create a strong password" {...field('password')} />
          <FormError message={errors.password} />
          <p className="text-[10px] text-outline px-1 uppercase tracking-wider font-semibold">
            Min. 8 chars · uppercase · lowercase · number
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm" className="block text-sm font-semibold text-on-surface-variant px-1">
            Confirm Password <span className="text-tertiary">*</span>
          </label>
          <IconInput id="confirm" placeholder="Re-type your password" {...field('confirm')} />
          <FormError message={errors.confirm} />
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tertiary text-white font-bold py-4 rounded-full shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 font-headline text-base mt-2"
        >
          {loading ? 'Setting password…' : 'Set Password'}
        </button>
      </form>
    </>
  );
}
