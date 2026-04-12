'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useBookingStore } from '@/lib/bookingStore';

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)salon_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { sessionToken, expiresAt, clear } = useBookingStore();

  const isAuthenticated = typeof window !== 'undefined' ? !!getToken() : false;

  function handleSignOut() {
    document.cookie = 'salon_token=; Max-Age=0; path=/';
    clear();
    router.push('/sign-in');
  }

  const isBookingFlow = pathname?.startsWith('/book');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-100 shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-stone-900">Ashen</span>
          <span className="hidden sm:inline text-sm text-stone-400 font-light">Salon</span>
        </Link>

        {/* Booking timer — shown during booking flow when hold is active */}
        {isBookingFlow && sessionToken && expiresAt && (
          <CountdownTimer
            expiresAt={expiresAt}
            onExpire={() => { clear(); router.push('/book/datetime?expired=true'); }}
          />
        )}

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4">
          <Link href="/book" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            Book Now
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/account" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                My Account
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-stone-600 hover:text-stone-900"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link href="/book" className="text-sm text-stone-700 py-1" onClick={() => setMenuOpen(false)}>Book Now</Link>
          {isAuthenticated ? (
            <>
              <Link href="/account" className="text-sm text-stone-700 py-1" onClick={() => setMenuOpen(false)}>My Account</Link>
              <button className="text-sm text-stone-700 py-1 text-left" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-stone-700 py-1" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/sign-up" className="text-sm text-stone-700 py-1" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
