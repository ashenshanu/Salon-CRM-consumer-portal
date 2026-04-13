'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { VERIFY_OTP, RESEND_OTP } from '@/lib/graphql/mutations';
import { setSessionToken } from '@/lib/session';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signup_email') : null;

  const [verifyOtp, { loading: verifying }] = useMutation<{
    verifyOtp: { token: string; user: { accountValidity: string; loyaltyScore: number } };
  }>(VERIFY_OTP);
  const [resendOtp, { loading: resending }] = useMutation(RESEND_OTP);

  useEffect(() => {
    if (!email) router.replace('/sign-up');
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const otp = digits.join('');

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setServerError('');
    if (cleaned && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { if (i < OTP_LENGTH) next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) { setServerError('Please enter all 6 digits.'); return; }
    setServerError('');
    try {
      const { data } = await verifyOtp({ variables: { email, otp } });
      await setSessionToken(data!.verifyOtp.token);
      const isNewAccount = sessionStorage.getItem('signup_new') === 'true';
      sessionStorage.removeItem('signup_email');
      sessionStorage.removeItem('signup_new');
      toast('Account verified! Welcome to Salon Bhagi.', 'success');
      router.push(isNewAccount ? '/set-password' : '/account');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  }

  async function handleResend() {
    if (!email || resendCooldown > 0) return;
    try {
      await resendOtp({ variables: { email } });
      toast('A new code has been sent to your email.', 'success');
      setResendCooldown(60);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      toast('Failed to resend code. Please try again.', 'error');
    }
  }

  if (!email) return null;

  return (
    <>
      {/* Page title */}
      <div className="text-center mb-8">
        {/* Mail icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-2">Check Your Email</h1>
        <p className="text-on-surface-variant font-medium text-sm">
          We sent a 6-digit code to{' '}
          <span className="font-bold text-on-surface">{email}</span>
        </p>
        <p className="text-xs text-outline mt-1">The code expires in 15 minutes</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* OTP digit boxes */}
        <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className={[
                'h-14 w-11 rounded-xl text-center text-xl font-bold text-on-surface transition-all',
                'focus:outline-none focus:scale-105 bg-surface-container-low border-none',
                serverError
                  ? 'ring-2 ring-red-400 bg-red-50/50'
                  : 'focus:ring-2 focus:ring-primary/30',
                digit ? 'ring-2 ring-primary/20' : '',
              ].join(' ')}
            />
          ))}
        </div>

        <FormError message={serverError} className="text-center mb-4" />

        {/* CTA */}
        <button
          type="submit"
          disabled={verifying || otp.length < OTP_LENGTH}
          className="w-full bg-tertiary text-white font-bold py-4 rounded-full shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 font-headline text-base"
        >
          {verifying ? 'Verifying…' : 'Verify Code'}
        </button>
      </form>

      {/* Resend */}
      <p className="mt-6 text-center text-sm font-medium text-on-surface-variant">
        Didn&apos;t receive it?{' '}
        {resendCooldown > 0 ? (
          <span className="text-outline">Resend in {resendCooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-primary font-bold hover:underline underline-offset-4 disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </p>
    </>
  );
}
