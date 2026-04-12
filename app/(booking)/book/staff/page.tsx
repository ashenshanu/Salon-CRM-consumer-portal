'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import { AVAILABLE_STAFF } from '@/lib/graphql/queries';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export default function StaffPage() {
  const router = useRouter();
  const {
    isGuestFlow,
    selectedServiceIds,
    bookingDate,
    bookingTime,
    staffUserId,
    isStaffSalonChoice,
    setStaff,
  } = useBookingStore();

  useEffect(() => {
    if (!selectedServiceIds.length) router.replace('/book/services');
    else if (!bookingDate || !bookingTime) router.replace('/book/datetime');
  }, [selectedServiceIds, bookingDate, bookingTime, router]);

  const { data, loading, error } = useQuery<{ availableStaff: StaffMember[] }>(AVAILABLE_STAFF, {
    variables: { date: bookingDate, time: bookingTime, serviceIds: selectedServiceIds },
    skip: !bookingDate || !bookingTime || !selectedServiceIds.length,
  });

  const staff = data?.availableStaff ?? [];

  function handleSelect(id: string) {
    setStaff(id, false);
  }

  function handleSalonChoice() {
    setStaff(null, true);
  }

  function handleContinue() {
    router.push(isGuestFlow ? '/book/guest-email' : '/book/summary');
  }

  const hasSelection = (!isStaffSalonChoice && staffUserId) || isStaffSalonChoice;

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose your stylist</h1>
        <p className="text-slate-500 text-sm">Select a staff member or let us assign one for you.</p>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={handleSalonChoice}
          className={[
            'w-full rounded-xl border p-4 text-left transition-all',
            isStaffSalonChoice
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-slate-100 bg-white hover:border-slate-300',
          ].join(' ')}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold text-sm">
              ?
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">No preference</p>
              <p className="text-sm text-slate-500">We&apos;ll assign the best available stylist</p>
            </div>
            {isStaffSalonChoice && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </button>

        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 py-2">{error.message}</p>
        ) : staff.length === 0 ? (
          <p className="text-sm text-slate-500 py-2 text-center">
            No specific staff available — please select &ldquo;No preference&rdquo;.
          </p>
        ) : (
          staff.map((member) => {
            const isSelected = staffUserId === member.id && !isStaffSalonChoice;
            return (
              <button
                key={member.id}
                onClick={() => handleSelect(member.id)}
                className={[
                  'w-full rounded-xl border p-4 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-300',
                ].join(' ')}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm uppercase">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      <Button fullWidth onClick={handleContinue} disabled={!hasSelection}>
        Continue
      </Button>
    </div>
  );
}
