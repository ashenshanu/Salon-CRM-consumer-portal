'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { SIGN_IN } from '@/lib/graphql/mutations';
import { setSessionToken } from '@/lib/session';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

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
      const { token } = data!.signIn;
      await setSessionToken(token);
      toast('Welcome back!', 'success');
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setServerError(msg);
    }
  }

  const field = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
      if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
    },
    error: !!errors[name],
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Sign in</h1>
      <p className="text-sm text-stone-500 mb-6">
        New here?{' '}
        <Link href="/sign-up" className="text-stone-900 font-medium hover:underline">Create an account</Link>
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="email" required>Email address</Label>
          <Input id="email" type="email" autoComplete="email" {...field('email')} />
          <FormError message={errors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="password" required>Password</Label>
            <Link href="/forgot-password" className="text-xs text-stone-500 hover:text-stone-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...field('password')} />
          <FormError message={errors.password} />
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-stone-400">or</span>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/book">
          <Button variant="secondary" fullWidth>
            Book as a Guest
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
