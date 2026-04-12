'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { ME, MY_BOOKINGS } from '@/lib/graphql/queries';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  loyaltyScore: number;
}

interface Booking {
  id: string;
  bookingRef: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  totalPrice: number;
  services: { serviceId: string; service: { name: string } }[];
}

// ── Stroke-style SVG icons ─────────────────────────────────────────────────

function ScissorsIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664l-5.94-1.981" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function UserIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function StarIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function timeSince(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  return `${Math.floor(days / 7)} weeks ago`;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  no_show: 'NO SHOW',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-amber-500',
  confirmed: 'text-secondary',
  completed: 'text-slate-400',
  cancelled: 'text-red-400',
  no_show: 'text-red-400',
};

const QUICK_ACTIONS = [
  { href: '/book', Icon: CalendarIcon, label: 'Book Appointment', desc: 'Schedule a new visit', active: true },
  { href: '/account/bookings', Icon: ScissorsIcon, label: 'My Bookings', desc: 'View all bookings', active: false },
  { href: '/account/profile', Icon: UserIcon, label: 'My Profile', desc: 'Manage account', active: false },
];

const FAQ_ITEMS = [
  'How do I reschedule my appointment?',
  'Can I book for a family member?',
  'What is your cancellation policy?',
  'How do loyalty points work?',
];

export default function AccountPage() {
  const { data: meData, loading: meLoading } = useQuery<{ me: User }>(ME);
  const { data: bookingsData, loading: bookingsLoading } = useQuery<{ myBookings: Booking[] }>(MY_BOOKINGS, {
    fetchPolicy: 'cache-and-network',
  });

  const user = meData?.me;
  const bookings = bookingsData?.myBookings ?? [];
  const recentBookings = [...bookings].slice(0, 4);

  return (
    <>
      {/* ── Hero (same gradient as header) ────────────────────────────────── */}
      <section className="hero-gradient text-white pt-12 pb-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
          {meLoading ? (
            <div className="h-12 w-80 bg-white/20 animate-pulse rounded-xl mx-auto mb-3" />
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 font-headline">
                Hello {user?.firstName},
              </h1>
              <p className="text-xl text-white/80 mb-10 font-light tracking-wide">
                Welcome to your Salon Bhagi portal
              </p>
            </>
          )}

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for a service…"
              className="w-full bg-white/20 backdrop-blur-md border-none rounded-full py-4 px-8 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2" aria-label="Search">
              <SearchIcon />
            </button>
          </div>
        </div>
      </section>

      {/* ── Quick action card overlapping hero ────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-3 bg-white rounded-xl shadow-xl overflow-hidden h-40">
          {QUICK_ACTIONS.map(({ href, Icon, label, desc, active }) => (
            <Link
              key={href}
              href={href}
              className={[
                'relative flex flex-col items-center justify-center gap-3 border-r border-slate-100 last:border-r-0 transition-colors',
                active ? 'bg-white' : 'bg-white opacity-50 hover:opacity-80',
              ].join(' ')}
            >
              {active && <div className="absolute inset-x-0 bottom-0 h-1 bg-tertiary" />}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${active ? 'bg-tertiary/10' : 'bg-slate-50'}`}>
                <Icon className={`h-6 w-6 ${active ? 'text-tertiary' : 'text-slate-400'}`} />
              </div>
              <div className="text-center px-3">
                <p className={`font-bold text-sm ${active ? 'text-tertiary' : 'text-slate-700'}`}>{label}</p>
                {active && <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{desc}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main 12-col content ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left 8-col: bookings + FAQ */}
          <div className="lg:col-span-8 space-y-10">

            {/* Recent bookings */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">My Recent Bookings</h2>
                <Link href="/account/bookings" className="text-tertiary text-xs font-bold hover:underline">View all</Link>
              </div>

              {bookingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm mb-4">No bookings yet</p>
                  <Link href="/book" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                    Book Your First Appointment
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                        <ScissorsIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {b.services.map((s) => s.service.name).join(', ')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {b.bookingRef} · {timeSince(b.bookingDate)}
                        </p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${STATUS_COLOR[b.status] ?? 'text-slate-400'}`}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* FAQ */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Help Centre</h2>
                <span className="text-tertiary text-xs font-bold">FAQ</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {FAQ_ITEMS.map((q) => (
                  <div key={q} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">?</div>
                    <p className="text-sm font-medium flex-1 text-slate-700">{q}</p>
                    <ChevronRightIcon />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right 4-col sidebar */}
          <div className="lg:col-span-4 space-y-8">

            {/* Loyalty score */}
            {!meLoading && user && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <StarIcon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-on-surface font-headline">{user.loyaltyScore}</p>
                  <p className="text-xs text-slate-400 font-medium">Loyalty Points</p>
                </div>
              </div>
            )}

            {/* Contact */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Contact Us</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Need help with a booking or have a special request?
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <PhoneIcon />
                    <span>+44 7700 000100</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <EnvelopeIcon />
                    <span className="truncate">hello@salonbhagi.com</span>
                  </div>
                </div>
                <button className="w-full bg-tertiary text-white py-2.5 rounded-lg font-bold hover:bg-tertiary/90 transition-colors text-sm shadow-lg shadow-tertiary/20">
                  Chat With Us
                </button>
              </div>
            </section>

            {/* Dark booking CTA */}
            <div className="bg-slate-900 text-white rounded-2xl p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ready for your next visit?</p>
                <p className="text-3xl font-extrabold mb-6 font-headline">Book Now</p>
                <Link
                  href="/book"
                  className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm"
                >
                  Confirm Booking
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
