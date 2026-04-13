import { gql } from '@apollo/client';

// ─── User ─────────────────────────────────────────────────────────────────────

export const ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      phone
      address
      city
      county
      gender
      ageGroup
      identityType
      identityNumber
      birthday
      profilePicture
      loyaltyScore
      userType
      accountValidity
      createdAt
    }
  }
`;

// ─── Services ─────────────────────────────────────────────────────────────────

export const SERVICES = gql`
  query Services($activeOnly: Boolean) {
    services(activeOnly: $activeOnly) {
      id
      name
      description
      category
      isActive
      variants {
        id
        gender
        ageGroup
        price
        durationMinutes
      }
    }
  }
`;

// ─── Booking ──────────────────────────────────────────────────────────────────

export const AVAILABLE_SLOTS = gql`
  query AvailableSlots($date: String!, $serviceIds: [ID!]!) {
    availableSlots(date: $date, serviceIds: $serviceIds) {
      time
      isAvailable
    }
  }
`;

export const AVAILABLE_STAFF = gql`
  query AvailableStaff($date: String!, $time: String!, $serviceIds: [ID!]!) {
    availableStaff(date: $date, time: $time, serviceIds: $serviceIds) {
      id
      firstName
      lastName
      profilePicture
    }
  }
`;

export const MY_BOOKINGS = gql`
  query MyBookings {
    myBookings {
      id
      bookingRef
      bookingDate
      bookingTime
      status
      totalPrice
      staffUserId
      notes
      services {
        serviceId
        priceAtBooking
        service {
          name
        }
      }
      createdAt
    }
  }
`;
