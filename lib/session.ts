'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'salon_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function setSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by Apollo Client on the client
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
