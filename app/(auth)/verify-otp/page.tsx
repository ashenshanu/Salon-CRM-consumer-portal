'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { VERIFY_OTP, RESEND_OTP } from '@/lib/graphql/mutations';
import { setSessionToken } from '@/lib/session';
import Button from '@/components/ui/Button';
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

  const [verifyOtp, { loading: verifying }] = useMutation<{ verifyOtp: { token: string } }>(VERIFY_OTP);
  const [resendOtp, { loading: resending }] = useMutation(RESEND_OTP);

  // Redirect if no email in session
  useEffect(() => {
    if (!email) router.replace('/sign-up');
  }, [email, router]);

  // Resend cooldown timer
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
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
      const { token } = data!.verifyOtp;
      await setSessionToken(token);
      sessionStorage.removeItem('signup_email');
      toast('Account verified! Welcome to Ashen.', 'success');
      router.push('/account');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setServerError(msg);
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
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xl mb-4">
        ✉
      </div>
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Check your email</h1>
      <p className="text-sm text-stone-500 mb-8">
        We sent a 6-digit code to <span className="font-medium text-stone-700">{email}</span>.
        It expires in 15 minutes.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
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
                'h-12 w-10 rounded-lg border text-center text-xl font-semibold text-stone-900 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                serverError
                  ? 'border-red-400 focus-visible:ring-red-300'
                  : 'border-stone-300 focus-visible:ring-stone-300',
              ].join(' ')}
            />
          ))}
        </div>

        <FormError message={serverError} className="text-center mb-4" />

        <Button type="submit" fullWidth loading={verifying} disabled={otp.length < OTP_LENGTH}>
          Verify Code
        </Button>
      </form>

      <div className="mt-5 text-sm text-stone-500">
        Didn&apos;t receive it?{' '}
        {resendCooldown > 0 ? (
          <span className="text-stone-400">Resend in {resendCooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-stone-900 font-medium hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
