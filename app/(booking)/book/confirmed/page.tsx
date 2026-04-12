'use client';

import Link from 'next/link';
import { useBookingStore } from '@/lib/bookingStore';
import Button from '@/components/ui/Button';

export default function ConfirmedPage() {
  const { confirmedBookingRef, isGuestFlow, clear } = useBookingStore();

  if (!confirmedBookingRef) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-500 text-sm mb-4">No booking found.</p>
        <Link href="/book">
          <Button variant="secondary">Start a New Booking</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 text-3xl mb-6">
        ✓
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
      <p className="text-stone-500 text-sm mb-6">
        Your appointment has been confirmed. We look forward to seeing you.
      </p>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-5 inline-block mb-8">
        <p className="text-xs text-stone-500 uppercase tracking-wide font-medium mb-1">
          Booking Reference
        </p>
        <p className="text-2xl font-bold text-stone-900 font-mono tracking-wider">
          {confirmedBookingRef}
        </p>
      </div>

      <div className="grid gap-3 max-w-xs mx-auto">
        {!isGuestFlow && (
          <Link href="/account/bookings">
            <Button fullWidth>View My Bookings</Button>
          </Link>
        )}
        <Link href="/book" onClick={() => clear()}>
          <Button variant="secondary" fullWidth>
            Book Another Appointment
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" fullWidth>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
