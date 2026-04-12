'use client';

import { useEffect, useState, useCallback } from 'react';

interface CountdownTimerProps {
  expiresAt: string; // ISO string
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({ expiresAt, onExpire, className = '' }: CountdownTimerProps) {
  const getRemaining = useCallback(() => {
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }, [expiresAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    const interval = setInterval(() => {
      const secs = getRemaining();
      setRemaining(secs);
      if (secs === 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getRemaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = remaining <= 60;
  const expired = remaining === 0;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-semibold',
        expired
          ? 'bg-red-100 text-red-700'
          : isUrgent
          ? 'bg-amber-100 text-amber-700 animate-pulse'
          : 'bg-stone-100 text-stone-700',
        className,
      ].join(' ')}
      aria-live="polite"
      aria-label={expired ? 'Session expired' : `${minutes}m ${seconds}s remaining`}
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {expired
        ? 'Expired'
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
    </span>
  );
}
