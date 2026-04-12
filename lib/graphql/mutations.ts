import { gql } from '@apollo/client';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const INITIATE_SIGN_UP = gql`
  mutation InitiateSignUp($input: InitiateSignUpInput!) {
    initiateSignUp(input: $input) {
      success
      message
      status
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      token
      user {
        id
        firstName
        lastName
        email
        userType
        accountValidity
        loyaltyScore
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOtp($email: String!) {
    resendOtp(email: $email)
  }
`;

export const SET_PASSWORD = gql`
  mutation SetPassword($password: String!) {
    setPassword(password: $password)
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        userType
        accountValidity
        loyaltyScore
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

// ─── User ─────────────────────────────────────────────────────────────────────

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
      birthday
      profilePicture
      loyaltyScore
    }
  }
`;

// ─── Booking ──────────────────────────────────────────────────────────────────

export const INITIATE_BOOKING_HOLD = gql`
  mutation InitiateBookingHold($input: InitiateBookingHoldInput!) {
    initiateBookingHold(input: $input) {
      sessionToken
      expiresAt
    }
  }
`;

export const CONFIRM_BOOKING = gql`
  mutation ConfirmBooking($sessionToken: String!, $input: ConfirmBookingInput!) {
    confirmBooking(sessionToken: $sessionToken, input: $input) {
      id
      bookingRef
      bookingDate
      bookingTime
      status
      totalPrice
      staffUserId
      services {
        serviceId
        priceAtBooking
        service {
          name
        }
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!, $reason: String) {
    cancelBooking(id: $id, reason: $reason) {
      id
      status
    }
  }
`;
