import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'salon_token';

// Routes that require authentication
const protectedRoutes = ['/account'];
// Routes only for unauthenticated users (redirect away if signed in)
const authRoutes = ['/sign-in', '/sign-up', '/verify-otp', '/forgot-password', '/reset-password'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = !!token;

  // Redirect unauthenticated users away from protected routes
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/account', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
