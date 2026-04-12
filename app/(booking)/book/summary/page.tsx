'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import { INITIATE_BOOKING_HOLD, CONFIRM_BOOKING } from '@/lib/graphql/mutations';
import { SERVICES } from '@/lib/graphql/queries';
import Button from '@/components/ui/Button';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';

interface ServiceVariant {
  price: number;
}

interface Service {
  id: string;
  name: string;
  variants: ServiceVariant[];
}

export default function SummaryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    isGuestFlow,
    selectedServiceIds,
    bookingDate,
    bookingTime,
    staffUserId,
    isStaffSalonChoice,
    recipientType,
    recipientDetails,
    recipientUserId,
    guestEmail,
    sessionToken,
    expiresAt,
    setHold,
    setConfirmed,
  } = useBookingStore();

  const [holdLoading, setHoldLoading] = useState(false);
  const [holdError, setHoldError] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!selectedServiceIds.length) { router.replace('/book/services'); return; }
    if (!bookingDate || !bookingTime) { router.replace('/book/datetime'); return; }
    if (isGuestFlow && !guestEmail) { router.replace('/book/guest-email'); return; }
  }, [selectedServiceIds, bookingDate, bookingTime, isGuestFlow, guestEmail, router]);

  const { data: servicesData } = useQuery<{ services: Service[] }>(SERVICES, {
    variables: { activeOnly: true },
  });

  const selectedServices = (servicesData?.services ?? []).filter((s) =>
    selectedServiceIds.includes(s.id)
  );

  const [initiateHold] = useMutation<{
    initiateBookingHold: { sessionToken: string; expiresAt: string };
  }>(INITIATE_BOOKING_HOLD);

  const [confirmBooking, { loading: confirming }] = useMutation<{
    confirmBooking: { id: string; bookingRef: string };
  }>(CONFIRM_BOOKING);

  useEffect(() => {
    if (sessionToken && expiresAt && new Date(expiresAt) > new Date()) return;
    if (!selectedServiceIds.length || !bookingDate || !bookingTime) return;

    setHoldLoading(true);
    setHoldError('');

    initiateHold({
      variables: {
        input: { serviceIds: selectedServiceIds, bookingDate, bookingTime },
      },
    })
      .then(({ data }) => {
        if (data?.initiateBookingHold) {
          setHold(data.initiateBookingHold.sessionToken, data.initiateBookingHold.expiresAt);
        }
      })
      .catch((err: Error) => {
        setHoldError(err.message || 'Failed to reserve your slot. Please try again.');
      })
      .finally(() => setHoldLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleExpire() {
    toast('Your session has expired. Please select a new time.', 'error');
    router.push('/book/datetime');
  }

  async function handleConfirm() {
    if (!sessionToken) return;

    try {
      const { data } = await confirmBooking({
        variables: {
          sessionToken,
          input: {
            staffUserId: isStaffSalonChoice ? null : staffUserId,
            isStaffSalonChoice,
            recipientUserId: recipientUserId ?? null,
            recipientDetails:
              recipientType === 'other' && recipientDetails
                ? {
                    firstName: recipientDetails.firstName,
                    lastName: recipientDetails.lastName,
                    phone: recipientDetails.phone,
                    gender: recipientDetails.gender,
                    ageGroup: recipientDetails.ageGroup,
                  }
                : null,
            guestEmail: isGuestFlow ? guestEmail : null,
            notes: notes.trim() || null,
          },
        },
      });

      const booking = data!.confirmBooking;
      setConfirmed(booking.bookingRef, booking.id);
      router.push('/book/confirmed');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to confirm booking. Please try again.';
      toast(msg, 'error');
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (holdLoading) {
    return (
      <div className="py-12 flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-stone-500 text-sm">Reserving your slot&hellip;</p>
      </div>
    );
  }

  if (holdError) {
    return (
      <div className="py-8 text-center space-y-4">
        <p className="text-red-600 text-sm">{holdError}</p>
        <Button variant="secondary" onClick={() => router.push('/book/datetime')}>
          Choose a different time
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">Review &amp; confirm</h1>
          <p className="text-stone-500 text-sm">Check your booking details before confirming.</p>
        </div>
        {expiresAt && (
          <CountdownTimer expiresAt={expiresAt} onExpire={handleExpire} className="shrink-0" />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5 mb-6">
        {/* Services */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Services
          </h2>
          <ul className="space-y-1">
            {selectedServices.map((svc) => (
              <li key={svc.id} className="flex items-center justify-between">
                <span className="text-stone-900 text-sm font-medium">{svc.name}</span>
                {svc.variants.length > 0 && (
                  <span className="text-stone-500 text-sm">
                    From £{Math.min(...svc.variants.map((v) => v.price)).toFixed(2)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-100" />

        {/* Date & Time */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Date &amp; Time
          </h2>
          <p className="text-stone-900 text-sm font-medium">
            {bookingDate ? formatDate(bookingDate) : '—'}
          </p>
          <p className="text-stone-500 text-sm">{bookingTime}</p>
        </div>

        <div className="border-t border-stone-100" />

        {/* Staff */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Stylist
          </h2>
          <p className="text-stone-900 text-sm font-medium">
            {isStaffSalonChoice ? "Salon's choice" : 'Selected stylist'}
          </p>
        </div>

        {/* Recipient */}
        {recipientType === 'other' && recipientDetails && (
          <>
            <div className="border-t border-stone-100" />
            <div>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                Recipient
              </h2>
              <p className="text-stone-900 text-sm font-medium">
                {recipientDetails.firstName} {recipientDetails.lastName}
              </p>
              <p className="text-stone-500 text-sm">{recipientDetails.phone}</p>
            </div>
          </>
        )}

        {/* Guest email */}
        {isGuestFlow && guestEmail && (
          <>
            <div className="border-t border-stone-100" />
            <div>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                Confirmation Email
              </h2>
              <p className="text-stone-900 text-sm font-medium">{guestEmail}</p>
            </div>
          </>
        )}

        <div className="border-t border-stone-100" />

        {/* Notes */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Notes (optional)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or instructions..."
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 resize-none"
          />
        </div>
      </div>

      <Button fullWidth loading={confirming} onClick={handleConfirm} disabled={!sessionToken}>
        Confirm Booking
      </Button>
    </div>
  );
}
