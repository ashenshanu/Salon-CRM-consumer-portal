'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBookingStore } from '@/lib/bookingStore';

function isLoggedIn(): boolean {
  if (typeof document === 'undefined') return false;
  return /(?:^|;\s*)salon_token=/.test(document.cookie);
}

export default function BookEntryPage() {
  const router = useRouter();
  const { clear, setGuestFlow } = useBookingStore();

  useEffect(() => {
    clear();
  }, [clear]);

  function handleGuest() {
    setGuestFlow(true);
    router.push('/book/services');
  }

  function handleSignedIn() {
    setGuestFlow(false);
    router.push('/book/for-who');
  }

  const loggedIn = isLoggedIn();

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Book an Appointment</h1>
        <p className="text-stone-500">Choose how you&apos;d like to continue.</p>
      </div>

      <div className="grid gap-4">
        {loggedIn ? (
          <button
            onClick={handleSignedIn}
            className="group rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm hover:border-stone-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-lg">Continue Booking</p>
                <p className="text-sm text-stone-500">Signed in — book for yourself or someone else</p>
              </div>
            </div>
          </button>
        ) : (
          <Link href="/sign-in?redirect=/book/for-who" className="block">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm hover:border-stone-400 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-lg">Sign In to Book</p>
                  <p className="text-sm text-stone-500">Book for yourself or someone else with your account</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <button
          onClick={handleGuest}
          className="group rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm hover:border-stone-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 font-bold text-sm">
              G
            </div>
            <div>
              <p className="font-semibold text-stone-900 text-lg">Continue as Guest</p>
              <p className="text-sm text-stone-500">No account needed — we&apos;ll send your confirmation by email</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
