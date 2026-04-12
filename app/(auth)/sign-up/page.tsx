'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { INITIATE_SIGN_UP } from '@/lib/graphql/mutations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

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
        if (result.status === 'guest_found') {
          toast(result.message, 'info');
        }
        sessionStorage.setItem('signup_email', form.email);
        router.push('/verify-otp');
        return;
      }

      if (result?.status === 'already_exists') {
        setServerError(result.message);
        return;
      }

      if (result?.status === 'blacklisted') {
        setServerError(result.message);
        return;
      }

      setServerError(result?.message || 'Something went wrong. Please try again.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
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
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Create an account</h1>
      <p className="text-sm text-stone-500 mb-6">
        Already have one?{' '}
        <Link href="/sign-in" className="text-stone-900 font-medium hover:underline">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" required>First name</Label>
            <Input id="firstName" autoComplete="given-name" {...field('firstName')} />
            <FormError message={errors.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName" required>Last name</Label>
            <Input id="lastName" autoComplete="family-name" {...field('lastName')} />
            <FormError message={errors.lastName} />
          </div>
        </div>

        <div>
          <Label htmlFor="email" required>Email address</Label>
          <Input id="email" type="email" autoComplete="email" {...field('email')} />
          <FormError message={errors.email} />
        </div>

        <div>
          <Label htmlFor="phone" required>Phone number</Label>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+44 7700 000000" {...field('phone')} />
          <FormError message={errors.phone} />
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{serverError}</p>
            {serverError.includes('already exists') && (
              <Link href="/sign-in" className="text-sm font-medium text-red-700 underline mt-1 inline-block">
                Go to sign in →
              </Link>
            )}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Continue
        </Button>
      </form>
    </div>
  );
}
