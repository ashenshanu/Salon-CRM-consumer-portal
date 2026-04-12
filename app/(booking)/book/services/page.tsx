'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import { SERVICES } from '@/lib/graphql/queries';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { SkeletonServiceCard } from '@/components/ui/Skeleton';

interface ServiceVariant {
  id: string;
  gender: string;
  ageGroup: string;
  price: number;
  durationMinutes: number;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  isActive: boolean;
  variants: ServiceVariant[];
}

function formatPrice(variants: ServiceVariant[]): string {
  if (!variants.length) return 'Price TBC';
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `£${min.toFixed(2)}` : `From £${min.toFixed(2)}`;
}

function formatDuration(variants: ServiceVariant[]): string {
  if (!variants.length) return '';
  const mins = variants.map((v) => v.durationMinutes);
  const min = Math.min(...mins);
  const max = Math.max(...mins);
  return min === max ? `${min} min` : `${min}–${max} min`;
}

export default function ServicesPage() {
  const router = useRouter();
  const { selectedServiceIds, setServices } = useBookingStore();
  const [selected, setSelected] = useState<string[]>(selectedServiceIds);

  const { data, loading, error } = useQuery<{ services: Service[] }>(SERVICES, {
    variables: { activeOnly: true },
  });

  const grouped = (data?.services ?? []).reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category || 'Other';
    (acc[cat] ??= []).push(svc);
    return acc;
  }, {});

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    if (!selected.length) return;
    setServices(selected);
    router.push('/book/datetime');
  }

  if (loading) {
    return (
      <div className="py-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => <SkeletonServiceCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-red-600 text-sm">{error.message}</p>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Select services</h1>
        <p className="text-stone-500 text-sm">Choose one or more services for your appointment.</p>
      </div>

      <div className="space-y-6 mb-8">
        {Object.entries(grouped).map(([category, services]) => (
          <div key={category}>
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
              {category}
            </h2>
            <div className="space-y-2">
              {services.map((svc) => {
                const isSelected = selected.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    onClick={() => toggle(svc.id)}
                    className={[
                      'w-full rounded-xl border p-4 text-left transition-all',
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-400',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className={[
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                              isSelected
                                ? 'border-stone-900 bg-stone-900'
                                : 'border-stone-300',
                            ].join(' ')}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-stone-900">{svc.name}</span>
                        </div>
                        {svc.description && (
                          <p className="mt-1 ml-7 text-sm text-stone-500 line-clamp-2">
                            {svc.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-stone-900 text-sm">{formatPrice(svc.variants)}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{formatDuration(svc.variants)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="sticky bottom-4">
          <Button fullWidth onClick={handleContinue}>
            Continue with {selected.length} service{selected.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}
