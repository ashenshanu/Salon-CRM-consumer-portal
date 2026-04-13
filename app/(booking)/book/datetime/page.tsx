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

function getMinDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function DateTimePage() {
  const router = useRouter();
  const { selectedServiceIds, bookingDate, bookingTime, setDateTime } = useBookingStore();

  const [date, setDate] = useState(bookingDate || getMinDate());
  const [selectedTime, setSelectedTime] = useState(bookingTime || '');

  useEffect(() => {
    if (!selectedServiceIds.length) router.replace('/book/services');
  }, [selectedServiceIds, router]);

  const { data, loading, error } = useQuery<{ availableSlots: TimeSlot[] }>(AVAILABLE_SLOTS, {
    variables: { date, serviceIds: selectedServiceIds },
    skip: !selectedServiceIds.length || !date,
    fetchPolicy: 'network-only',
  });

  const allSlots = data?.availableSlots ?? [];

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
    setSelectedTime('');
  }

  function handleContinue() {
    if (!date || !selectedTime) return;
    setDateTime(date, selectedTime);
    router.push('/book/staff');
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose a date &amp; time</h1>
        <p className="text-slate-500 text-sm">Select when you&apos;d like your appointment.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            min={getMinDate()}
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
