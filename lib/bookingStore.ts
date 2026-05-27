'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RecipientDetails {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  ageGroup: string;
}

interface BookingState {
  // Who is the booking for?
  isGuestFlow: boolean;
  recipientType: 'self' | 'other' | null; // 'other' = third party or guest
  recipientUserId: string | null;
  recipientDetails: RecipientDetails | null;

  // Services
  selectedServiceIds: string[];
  selectedVariants: Record<string, string>; // serviceId → variantId

  // Date & time
  bookingDate: string | null; // YYYY-MM-DD
  bookingTime: string | null; // HH:MM

  // Hold
  sessionToken: string | null;
  expiresAt: string | null; // ISO string

  // Staff
  staffUserId: string | null;
  isStaffSalonChoice: boolean;

  // Guest email (guest flow only)
  guestEmail: string | null;

  // Confirmed booking
  confirmedBookingRef: string | null;
  confirmedBookingId: string | null;

  // Actions
  setGuestFlow: (isGuest: boolean) => void;
  setRecipient: (type: 'self' | 'other', userId?: string, details?: RecipientDetails) => void;
  setServices: (ids: string[]) => void;
  setVariantMap: (variants: Record<string, string>) => void;
  setDateTime: (date: string, time: string) => void;
  setHold: (sessionToken: string, expiresAt: string) => void;
  setStaff: (staffUserId: string | null, isSalonChoice: boolean) => void;
  setGuestEmail: (email: string | null) => void;
  setConfirmed: (bookingRef: string, bookingId: string) => void;
  clear: () => void;
}

const initialState = {
  isGuestFlow: false,
  recipientType: null,
  recipientUserId: null,
  recipientDetails: null,
  selectedServiceIds: [],
  selectedVariants: {},
  bookingDate: null,
  bookingTime: null,
  sessionToken: null,
  expiresAt: null,
  staffUserId: null,
  isStaffSalonChoice: true,
  guestEmail: null,
  confirmedBookingRef: null,
  confirmedBookingId: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setGuestFlow: (isGuest) => set({ isGuestFlow: isGuest }),

      setRecipient: (type, userId, details) =>
        set({
          recipientType: type,
          recipientUserId: userId ?? null,
          recipientDetails: details ?? null,
        }),

      setServices: (ids) => set({ selectedServiceIds: ids }),
      setVariantMap: (variants) => set({ selectedVariants: variants }),

      setDateTime: (date, time) => set({ bookingDate: date, bookingTime: time }),

      setHold: (sessionToken, expiresAt) => set({ sessionToken, expiresAt }),

      setStaff: (staffUserId, isSalonChoice) =>
        set({ staffUserId, isStaffSalonChoice: isSalonChoice }),

      setGuestEmail: (email) => set({ guestEmail: email }),

      setConfirmed: (bookingRef, bookingId) =>
        set({ confirmedBookingRef: bookingRef, confirmedBookingId: bookingId }),

      clear: () => set(initialState),
    }),
    {
      name: 'salon-booking-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
