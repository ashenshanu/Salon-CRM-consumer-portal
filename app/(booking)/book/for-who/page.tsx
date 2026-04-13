'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/bookingStore';

export default function ForWhoPage() {
  const router = useRouter();
  const { isGuestFlow, setRecipient } = useBookingStore();

  useEffect(() => {
    if (isGuestFlow) router.replace('/book/services');
  }, [isGuestFlow, router]);

  function handleSelf() {
    setRecipient('self');
    router.push('/book/services');
  }

  function handleOther() {
    setRecipient('other');
    router.push('/book/guest-details');
  }

  if (isGuestFlow) return null;

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Who is this appointment for?</h1>
        <p className="text-slate-500 text-sm">We&apos;ll tailor the experience accordingly.</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={handleSelf}
          className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
              Me
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">For myself</p>
              <p className="text-sm text-slate-500">Book a personal appointment</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleOther}
          className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
              +1
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">For someone else</p>
              <p className="text-sm text-slate-500">Book on behalf of a friend or family member</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
