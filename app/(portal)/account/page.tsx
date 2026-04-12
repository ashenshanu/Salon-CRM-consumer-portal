'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { ME } from '@/lib/graphql/queries';
import { SkeletonCard } from '@/components/ui/Skeleton';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  loyaltyScore: number;
  accountValidity: string;
}

export default function AccountPage() {
  const { data, loading, error } = useQuery<{ me: User }>(ME);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded mb-2" />
        <div className="h-4 w-64 bg-stone-100 animate-pulse rounded mb-8" />
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error || !data?.me) {
    return <p className="text-red-600 text-sm py-8">{error?.message ?? 'Failed to load account.'}</p>;
  }

  const user = data.me;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-stone-500 text-sm">Manage your bookings and profile settings.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Loyalty Score</p>
          <p className="text-3xl font-bold text-stone-900">{user.loyaltyScore}</p>
          <p className="text-stone-500 text-xs mt-1">points earned</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Account Status</p>
          <p className="text-lg font-semibold text-stone-900 capitalize">{user.accountValidity}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Contact</p>
          <p className="text-sm text-stone-700 font-medium truncate">{user.email ?? '—'}</p>
          <p className="text-xs text-stone-400 mt-0.5">{user.phone ?? '—'}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/bookings"
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-400 hover:shadow-md transition-all"
        >
          <h2 className="font-semibold text-stone-900 mb-1 group-hover:underline">My Bookings</h2>
          <p className="text-sm text-stone-500">View and manage your upcoming and past appointments.</p>
        </Link>

        <Link
          href="/account/profile"
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-400 hover:shadow-md transition-all"
        >
          <h2 className="font-semibold text-stone-900 mb-1 group-hover:underline">Profile Settings</h2>
          <p className="text-sm text-stone-500">Update your personal details and preferences.</p>
        </Link>

        <Link
          href="/book"
          className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-400 hover:shadow-md transition-all"
        >
          <h2 className="font-semibold text-stone-900 mb-1 group-hover:underline">Book an Appointment</h2>
          <p className="text-sm text-stone-500">Schedule your next visit at Ashen.</p>
        </Link>
      </div>
    </div>
  );
}
