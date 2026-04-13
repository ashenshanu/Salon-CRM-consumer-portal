'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ── Stroke-style step icons ─────────────────────────────────────────────────

function ServiceIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664l-5.94-1.981" />
    </svg>
  );
}

function StylistIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function PersonIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  );
}

function ReviewIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

// ── Step config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Services', step: 1, Icon: ServiceIcon, paths: ['/book/services'] },
  { label: 'Schedule', step: 2, Icon: CalendarIcon, paths: ['/book/datetime'] },
  { label: 'Stylist', step: 3, Icon: StylistIcon, paths: ['/book/staff'] },
  { label: 'Client Info', step: 4, Icon: PersonIcon, paths: ['/book/guest-email', '/book/guest-details', '/book/for-who'] },
  { label: 'Review', step: 5, Icon: ReviewIcon, paths: ['/book/summary', '/book/confirmed'] },
];

function getActiveStep(pathname: string): number {
  for (const step of STEPS) {
    if (step.paths.some((p) => pathname.startsWith(p))) return step.step;
  }
  return 0; // entry or unknown
}

// ── Layout ──────────────────────────────────────────────────────────────────

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const activeStep = getActiveStep(pathname);
  const showSteps = activeStep > 0;

  return (
    <>
      <Header />

      {/* Hero — same gradient as header */}
      <section className="hero-gradient text-white pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
          <h1 className="text-3xl font-extrabold font-headline mb-1">Book an Appointment</h1>
          <p className="text-white/70 text-sm">Salon Bhagi · Premium Salon Services</p>
        </div>
      </section>

      {/* Step indicator card overlapping hero */}
      {showSteps && (
        <div className="mx-auto max-w-7xl px-6 sm:px-8 -mt-12 relative z-10 mb-8">
          <div className="grid grid-cols-5 bg-white rounded-xl shadow-xl overflow-hidden h-36">
            {STEPS.map(({ label, step, Icon }) => {
              const isActive = step === activeStep;
              const isDone = step < activeStep;
              return (
                <div
                  key={label}
                  className={[
                    'relative flex flex-col items-center justify-center gap-2.5 border-r border-slate-100 last:border-r-0 transition-all',
                    isActive ? 'bg-white' : isDone ? 'bg-white' : 'bg-white opacity-40',
                  ].join(' ')}
                >
                  {isActive && <div className="absolute inset-x-0 bottom-0 h-1 bg-tertiary" />}
                  <div className={[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-tertiary/10' : isDone ? 'bg-secondary-light/50' : 'bg-slate-50',
                  ].join(' ')}>
                    {isDone ? (
                      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className={`h-6 w-6 ${isActive ? 'text-tertiary' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div className="text-center px-2">
                    <p className={`font-bold text-xs ${isActive ? 'text-tertiary' : isDone ? 'text-secondary' : 'text-slate-700'}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {isActive ? 'Active' : isDone ? 'Done' : `Step ${step}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Page content */}
      <main className={[
        'flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6',
        showSteps ? 'pb-12' : 'py-8',
      ].join(' ')}>
        {children}
      </main>

      <Footer />
    </>
  );
}
