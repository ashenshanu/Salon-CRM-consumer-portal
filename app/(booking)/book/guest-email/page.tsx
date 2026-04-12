'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/bookingStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';

export default function GuestEmailPage() {
  const router = useRouter();
  const { isGuestFlow, guestEmail, setGuestEmail, selectedServiceIds, bookingDate, bookingTime } =
    useBookingStore();

  const [email, setEmail] = useState(guestEmail || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isGuestFlow) { router.replace('/book/summary'); return; }
    if (!selectedServiceIds.length) { router.replace('/book/services'); return; }
    if (!bookingDate || !bookingTime) { router.replace('/book/datetime'); return; }
  }, [isGuestFlow, selectedServiceIds, bookingDate, bookingTime, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setGuestEmail(email.trim());
    router.push('/book/summary');
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Your email address</h1>
        <p className="text-stone-500 text-sm">We&apos;ll send your booking confirmation here.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4"
      >
        <div>
          <Label htmlFor="email" required>Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            error={!!error}
            placeholder="you@example.com"
          />
          <FormError message={error} />
        </div>

        <Button type="submit" fullWidth>
          Continue to Summary
        </Button>
      </form>
    </div>
  );
}
