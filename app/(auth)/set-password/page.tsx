'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { SET_PASSWORD } from '@/lib/graphql/mutations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

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
      const msg = err instanceof Error ? err.message : 'Failed to set password. Please try again.';
      setServerError(msg);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Set your password</h1>
      <p className="text-sm text-stone-500 mb-6">
        Create a password to secure your account. You can sign in with it next time.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="password" required>Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }));
              if (errors.password) setErrors((er) => { const n = { ...er }; delete n.password; return n; });
            }}
            error={!!errors.password}
          />
          <FormError message={errors.password} />
        </div>

        <div>
          <Label htmlFor="confirm" required>Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => {
              setForm((f) => ({ ...f, confirm: e.target.value }));
              if (errors.confirm) setErrors((er) => { const n = { ...er }; delete n.confirm; return n; });
            }}
            error={!!errors.confirm}
          />
          <FormError message={errors.confirm} />
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Set Password
        </Button>

        <button
          type="button"
          onClick={() => router.push('/account')}
          className="w-full text-center text-xs text-stone-400 hover:text-stone-600 mt-1"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}
