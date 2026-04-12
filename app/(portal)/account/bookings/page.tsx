'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { MY_BOOKINGS } from '@/lib/graphql/queries';
import { CANCEL_BOOKING } from '@/lib/graphql/mutations';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';

interface BookingService {
  serviceId: string;
  priceAtBooking: number;
  service: { name: string };
}

interface Booking {
  id: string;
  bookingRef: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  totalPrice: number;
  notes: string | null;
  services: BookingService[];
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-stone-100 text-stone-500',
  no_show: 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BookingsPage() {
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<{ myBookings: Booking[] }>(MY_BOOKINGS, {
    fetchPolicy: 'cache-and-network',
  });

  const [cancelBooking] = useMutation<{ cancelBooking: { id: string; status: string } }>(CANCEL_BOOKING);

  async function handleCancel(id: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await cancelBooking({ variables: { id } });
      toast('Booking cancelled.', 'success');
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel booking.';
      toast(msg, 'error');
    } finally {
      setCancellingId(null);
    }
  }

  const bookings = data?.myBookings ?? [];
  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const past = bookings.filter((b) => b.status !== 'pending' && b.status !== 'confirmed');

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-sm py-8">{error.message}</p>;
  }

  function BookingCard({ booking }: { booking: Booking }) {
    const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
    return (
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-mono text-xs font-semibold text-stone-400 uppercase tracking-wide">
              {booking.bookingRef}
            </p>
            <p className="font-semibold text-stone-900 mt-0.5">
              {formatDate(booking.bookingDate)} at {booking.bookingTime}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[booking.status] ?? 'bg-stone-100 text-stone-600'}`}
          >
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        <ul className="space-y-0.5 mb-3">
          {booking.services.map((svc) => (
            <li key={svc.serviceId} className="flex items-center justify-between text-sm">
              <span className="text-stone-700">{svc.service.name}</span>
              <span className="text-stone-400">£{svc.priceAtBooking.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-900">
            Total: £{booking.totalPrice.toFixed(2)}
          </p>
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              loading={cancellingId === booking.id}
              onClick={() => handleCancel(booking.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-6">My Bookings</h1>
        <div className="text-center py-16">
          <p className="text-stone-400 text-sm mb-4">You don&apos;t have any bookings yet.</p>
          <Link href="/book">
            <Button>Book an Appointment</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
        <Link href="/book">
          <Button size="sm">New Booking</Button>
        </Link>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Past
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
