'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useBookingStore } from '@/lib/bookingStore';
import { SERVICES } from '@/lib/graphql/queries';
import Button from '@/components/ui/Button';
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

function variantLabel(v: ServiceVariant): string {
  const parts: string[] = [];
  if (v.gender !== 'any') parts.push(v.gender.charAt(0).toUpperCase() + v.gender.slice(1));
  if (v.ageGroup !== 'any') parts.push(v.ageGroup.charAt(0).toUpperCase() + v.ageGroup.slice(1));
  return parts.length ? parts.join(' ') : 'Standard';
}

function formatPrice(price: number): string {
  return `රු ${price.toFixed(2)}`;
}

function formatDuration(mins: number): string {
  return `${mins} min`;
}

function priceRange(variants: ServiceVariant[]): string {
  if (!variants.length) return 'Price TBC';
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `From ${formatPrice(min)}`;
}

export default function ServicesPage() {
  const router = useRouter();
  const { selectedServiceIds, selectedVariants, setServices, setVariantMap } = useBookingStore();

  // Local selection state — synced to store only on Continue
  const [selected, setSelected] = useState<string[]>(selectedServiceIds);
  const [variantMap, setVariantMapLocal] = useState<Record<string, string>>(selectedVariants);
  // Which multi-variant service is expanded for variant picking
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ services: Service[] }>(SERVICES, {
    variables: { activeOnly: true },
  });

  const grouped = (data?.services ?? []).reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category || 'Other';
    (acc[cat] ??= []).push(svc);
    return acc;
  }, {});

  // ── Toggle service selection ──────────────────────────────────────────────
  function handleServiceClick(svc: Service) {
    const isSelected = selected.includes(svc.id);

    if (isSelected) {
      // Deselect
      setSelected((prev) => prev.filter((id) => id !== svc.id));
      setVariantMapLocal((prev) => {
        const next = { ...prev };
        delete next[svc.id];
        return next;
      });
      setExpandedId(null);
      return;
    }

    if (svc.variants.length <= 1) {
      // Single or no variant — auto-select
      setSelected((prev) => [...prev, svc.id]);
      if (svc.variants.length === 1) {
        setVariantMapLocal((prev) => ({ ...prev, [svc.id]: svc.variants[0].id }));
      }
      setExpandedId(null);
    } else {
      // Multiple variants — expand picker
      setExpandedId((prev) => (prev === svc.id ? null : svc.id));
    }
  }

  // ── Select a specific variant ─────────────────────────────────────────────
  function handleVariantSelect(svc: Service, variantId: string) {
    if (!selected.includes(svc.id)) {
      setSelected((prev) => [...prev, svc.id]);
    }
    setVariantMapLocal((prev) => ({ ...prev, [svc.id]: variantId }));
    setExpandedId(null);
  }

  // ── Continue to next step ─────────────────────────────────────────────────
  function handleContinue() {
    if (!selected.length) return;
    setServices(selected);
    setVariantMap(variantMap);
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
    return <p className="py-8 text-center text-red-600 text-sm">{error.message}</p>;
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Select services</h1>
        <p className="text-slate-500 text-sm">Choose one or more services for your appointment.</p>
      </div>

      <div className="space-y-6 mb-8">
        {Object.entries(grouped).map(([category, services]) => (
          <div key={category}>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {category}
            </h2>
            <div className="space-y-2">
              {services.map((svc) => {
                const isSelected = selected.includes(svc.id);
                const isExpanded = expandedId === svc.id;
                const chosenVariantId = variantMap[svc.id];
                const chosenVariant = svc.variants.find((v) => v.id === chosenVariantId);
                const hasMultipleVariants = svc.variants.length > 1;

                return (
                  <div
                    key={svc.id}
                    className={[
                      'rounded-xl border transition-all overflow-hidden',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : isExpanded
                        ? 'border-slate-300 bg-white shadow-sm'
                        : 'border-slate-100 bg-white',
                    ].join(' ')}
                  >
                    {/* Service header — always clickable */}
                    <button
                      onClick={() => handleServiceClick(svc)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* Checkbox indicator */}
                            <div
                              className={[
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-slate-200',
                              ].join(' ')}
                            >
                              {isSelected && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{svc.name}</span>
                            {/* Expand chevron for multi-variant */}
                            {hasMultipleVariants && !isSelected && (
                              <svg
                                className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                          {svc.description && (
                            <p className="mt-1 ml-7 text-sm text-slate-500 line-clamp-2">
                              {svc.description}
                            </p>
                          )}
                          {/* Show selected variant chip */}
                          {isSelected && chosenVariant && hasMultipleVariants && (
                            <div className="mt-2 ml-7 flex items-center gap-1.5">
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {variantLabel(chosenVariant)}
                              </span>
                              <span className="text-xs text-slate-400">·</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(svc.id);
                                }}
                                className="text-xs text-primary underline underline-offset-2"
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {isSelected && chosenVariant ? (
                            <>
                              <p className="font-semibold text-slate-900 text-sm">
                                {formatPrice(chosenVariant.price)}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {formatDuration(chosenVariant.durationMinutes)}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-slate-900 text-sm">
                                {priceRange(svc.variants)}
                              </p>
                              {svc.variants.length > 0 && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {hasMultipleVariants
                                    ? `${svc.variants.length} options`
                                    : formatDuration(svc.variants[0].durationMinutes)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Variant picker — shown when expanded */}
                    {(isExpanded || (isSelected && hasMultipleVariants && expandedId === svc.id)) && (
                      <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Choose an option
                        </p>
                        <div className="space-y-2">
                          {svc.variants.map((v) => {
                            const isChosen = chosenVariantId === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => handleVariantSelect(svc, v.id)}
                                className={[
                                  'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all',
                                  isChosen
                                    ? 'border-primary bg-primary/5'
                                    : 'border-slate-200 bg-white hover:border-slate-300',
                                ].join(' ')}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={[
                                      'h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors',
                                      isChosen ? 'border-primary bg-primary' : 'border-slate-300',
                                    ].join(' ')}
                                  />
                                  <span className="text-sm font-medium text-slate-800">
                                    {variantLabel(v)}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold text-slate-900">
                                    {formatPrice(v.price)}
                                  </span>
                                  <span className="ml-2 text-xs text-slate-400">
                                    {formatDuration(v.durationMinutes)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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
