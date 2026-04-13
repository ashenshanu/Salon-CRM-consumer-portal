'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { MY_BOOKINGS } from '@/lib/graphql/queries';
import { CANCEL_BOOKING } from '@/lib/graphql/mutations';
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

// ── SVG icons ─────────────────────────────────────────────────────────────

function ScissorsIcon() {
  return (
    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664l-5.94-1.981" />
    </svg>
  );
}

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-secondary-light text-secondary',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-red-50 text-red-500',
  no_show: 'bg-red-100 text-red-600',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-2 pl-13 mb-3">
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="h-px bg-slate-50 mb-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-7 bg-slate-100 rounded-lg w-20" />
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

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
      toast(err instanceof Error ? err.message : 'Failed to cancel booking.', 'error');
    } finally {
      setCancellingId(null);
    }
  }

  const bookings = data?.myBookings ?? [];
  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const past = bookings.filter((b) => b.status !== 'pending' && b.status !== 'confirmed');

  function BookingCard({ booking }: { booking: Booking }) {
    const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/30 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <ScissorsIcon />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {booking.bookingRef}
              </p>
              <p className="font-semibold text-on-surface mt-0.5 text-sm">
                {formatDate(booking.bookingDate)} at {booking.bookingTime}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize shrink-0 ${STATUS_STYLES[booking.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        <ul className="space-y-1.5 mb-4 pl-13">
          {booking.services.map((svc) => (
            <li key={svc.serviceId} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{svc.service.name}</span>
              <span className="text-slate-400 font-medium">රු{svc.priceAtBooking.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <p className="text-sm font-bold text-on-surface">
            Total: රු{booking.totalPrice.toFixed(2)}
          </p>
          {canCancel && (
            <button
              disabled={cancellingId === booking.id}
              onClick={() => handleCancel(booking.id)}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {cancellingId === booking.id ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="hero-gradient text-white pt-12 pb-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 font-headline">My Bookings</h1>
          <p className="text-xl text-white/80 font-light tracking-wide">
            View and manage all your salon appointments
          </p>
        </div>
      </section>

      {/* ── Content (overlaps hero) ───────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 -mt-10 pb-20">

        {/* New Booking button */}
        <div className="flex justify-end mb-6">
          <Link
            href="/book"
            className="px-5 py-2.5 rounded-xl bg-tertiary hover:bg-tertiary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-tertiary/20"
          >
            + New Booking
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-red-500 text-sm">{error.message}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <ScissorsIcon />
            </div>
            <p className="text-slate-500 text-sm mb-5 font-medium">You don&apos;t have any bookings yet.</p>
            <Link
              href="/book"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-tertiary hover:bg-tertiary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-tertiary/20"
            >
              Book an Appointment
            </Link>
          </div>
        )}

        {/* Upcoming */}
        {!loading && upcoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
            </div>
          </div>
        )}

        {/* Past */}
        {!loading && past.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Past
            </h2>
            <div className="space-y-3">
              {past.map((b) => <BookingCard key={b.id} booking={b} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
