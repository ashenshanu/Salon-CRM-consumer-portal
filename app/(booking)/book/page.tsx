'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBookingStore } from '@/lib/bookingStore';

function isLoggedIn(): boolean {
  if (typeof document === 'undefined') return false;
  return /(?:^|;\s*)salon_token=/.test(document.cookie);
}

function UserIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  );
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
        <h2 className="text-2xl font-bold text-on-surface font-headline mb-2">How would you like to book?</h2>
        <p className="text-slate-500 text-sm">Choose an option to continue your booking.</p>
      </div>

      <div className="grid gap-4">
        {loggedIn ? (
          <button
            onClick={handleSignedIn}
            className="group rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserIcon />
              </div>
              <div>
                <p className="font-bold text-on-surface text-base">Continue with my account</p>
                <p className="text-sm text-slate-500 mt-0.5">Book for yourself or someone else</p>
              </div>
            </div>
          </button>
        ) : (
          <Link href="/sign-in?redirect=/book/for-who" className="block">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserIcon />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-base">Sign in to book</p>
                  <p className="text-sm text-slate-500 mt-0.5">Track bookings and earn loyalty points</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <button
          onClick={handleGuest}
          className="group rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <GuestIcon />
            </div>
            <div>
              <p className="font-bold text-on-surface text-base">Continue as Guest</p>
              <p className="text-sm text-slate-500 mt-0.5">No account needed — confirmation sent by email</p>
            </div>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary font-semibold hover:underline">Create one for free</Link>
      </p>
    </div>
  );
}
