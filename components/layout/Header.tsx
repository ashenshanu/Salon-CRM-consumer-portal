'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { ME } from '@/lib/graphql/queries';

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)salon_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ── SVG stroke icons ─────────────────────────────────────────────────────────

function BellIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Nav links config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/account', label: 'Dashboard', exact: true },
  { href: '/account/bookings', label: 'Bookings', exact: false },
  { href: '/account/profile', label: 'Profile', exact: false },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { sessionToken, expiresAt, clear } = useBookingStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  const { data } = useQuery<{ me: { firstName: string; lastName: string } }>(ME, {
    skip: !isAuthenticated,
    fetchPolicy: 'cache-first',
  });

  const user = data?.me;
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '?';
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const isBookingFlow = pathname?.startsWith('/book');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSignOut() {
    document.cookie = 'salon_token=; Max-Age=0; path=/';
    clear();
    setIsAuthenticated(false);
    setDropdownOpen(false);
    router.push('/sign-in');
  }

  function isActive(link: { href: string; exact: boolean }) {
    if (link.exact) return pathname === link.href;
    return pathname?.startsWith(link.href);
  }

  return (
    <header className="sticky top-0 z-40 hero-gradient text-white">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">

        {/* Left: logo + nav links */}
        <div className="flex items-center gap-10">
          <Link href={isAuthenticated ? '/account' : '/'} className="text-xl font-extrabold tracking-tight uppercase shrink-0">
            Salon Bhagi
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'pb-0.5 transition-opacity',
                    isActive(link)
                      ? 'border-b-2 border-white opacity-100'
                      : 'opacity-80 hover:opacity-100',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center: booking hold timer */}
        {isBookingFlow && sessionToken && expiresAt && (
          <CountdownTimer
            expiresAt={expiresAt}
            onExpire={() => { clear(); router.push('/book/datetime?expired=true'); }}
          />
        )}

        {/* Right */}
        <div className="hidden md:flex items-center gap-5">
          {isAuthenticated ? (
            <>
              {/* Notification icons */}
              <button className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Notifications">
                <BellIcon />
              </button>
              <button className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Favourites">
                <HeartIcon />
              </button>

              {/* User pill with dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  {fullName && <span className="text-sm font-medium">{fullName}</span>}
                  <ChevronDownIcon />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <Link
                      href="/account/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Profile
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-sm font-bold bg-white text-primary rounded-full hover:bg-white/90 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 opacity-80 hover:opacity-100 transition-opacity"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary-dark px-6 py-3 flex flex-col gap-1">
          {isAuthenticated ? (
            <>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive(link) ? 'bg-white/20 font-semibold' : 'opacity-80 hover:bg-white/10'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={handleSignOut}
                className="px-3 py-2.5 text-sm text-left text-white/60 rounded-lg hover:bg-white/10"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="px-3 py-2.5 text-sm opacity-80 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/sign-up" className="px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
