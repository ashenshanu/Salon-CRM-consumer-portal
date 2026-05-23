'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import { AVAILABLE_SLOTS } from '@/lib/graphql/queries';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

const BUFFER_MINUTES = 30;

function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLocalCutoffTime(): string | null {
  const today = getLocalDateString();
  // Only applies when the selected date is today — return null for future dates
  return today; // caller compares selected date against this
}

function slotPassedLocally(slotTime: string): boolean {
  const now = new Date();
  const cutoff = now.getHours() * 60 + now.getMinutes() + BUFFER_MINUTES;
  const [h, m] = slotTime.split(':').map(Number);
  return h * 60 + m <= cutoff;
}

export default function DateTimePage() {
  const router = useRouter();
  const { selectedServiceIds, bookingDate, bookingTime, setDateTime } = useBookingStore();

  const today = getLocalDateString();
  const [date, setDate] = useState(bookingDate || today);
  const [selectedTime, setSelectedTime] = useState(bookingTime || '');

  useEffect(() => {
    if (!selectedServiceIds.length) router.replace('/book/services');
  }, [selectedServiceIds, router]);

  const { data, loading, error } = useQuery<{ availableSlots: TimeSlot[] }>(AVAILABLE_SLOTS, {
    variables: { date, serviceIds: selectedServiceIds },
    skip: !selectedServiceIds.length || !date,
    fetchPolicy: 'network-only',
  });

  const isToday = date === getLocalCutoffTime();

  const allSlots = (data?.availableSlots ?? []).map((slot) => ({
    ...slot,
    // Client-side guard: also disable past slots based on local time
    isAvailable: slot.isAvailable && !(isToday && slotPassedLocally(slot.time)),
  }));

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
    setSelectedTime('');
  }

  function handleContinue() {
    if (!date || !selectedTime) return;
    setDateTime(date, selectedTime);
    router.push('/book/staff');
  }

  const hasAnyAvailable = allSlots.some((s) => s.isAvailable);

  return (
    <div className="py-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose a date &amp; time</h1>
        <p className="text-slate-500 text-sm">Select when you&apos;d like your appointment.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
            Date
            {isToday && (
              <span className="ml-2 text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                Today
              </span>
            )}
          </label>
          <input
            id="date"
            type="date"
            value={date}
            min={today}
            onChange={handleDateChange}
            className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Available times</p>
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error.message}</p>
          ) : allSlots.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No slots for this date. Try another day.
            </p>
          ) : !hasAnyAvailable ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              {isToday
                ? 'No more slots available today. Please select a future date.'
                : 'No available slots for this date. Try another day.'}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {allSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.isAvailable}
                  onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                  className={[
                    'rounded-lg border py-2 text-sm font-medium transition-colors',
                    !slot.isAvailable
                      ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                      : selectedTime === slot.time
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300',
                  ].join(' ')}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button fullWidth onClick={handleContinue} disabled={!selectedTime}>
          Continue
        </Button>
      </div>
    </div>
  );
}
