import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simulating protected routes
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath = path === '/login' || path === '/reset-password';

  // For now, we simulate a session by checking a cookie (would be set by Firebase/NextAuth)
  const token = request.cookies.get('session')?.value || '';

  // Redirect logic (Simulated for initial setup)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

// Configure middleware matching
export const config = {
  matcher: [
    '/',
    '/login',
    '/reset-password',
    '/users/:path*',
    '/passes/:path*',
    '/gates/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/utilities/:path*',
  ],
};
