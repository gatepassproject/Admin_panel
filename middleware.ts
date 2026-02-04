import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const userRole = request.cookies.get('user_role');
    const userDepartment = request.cookies.get('user_department');

    // Define paths
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');
    const isDashboard = request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/(dashboard)'); // Note: Next.js routing might not match (dashboard) in pathname, checking root and unrelated paths

    // Real check for dashboard routes (everything that isn't login, static, or api)
    const isProtectedPath = !request.nextUrl.pathname.startsWith('/_next') &&
        !request.nextUrl.pathname.startsWith('/static') &&
        !request.nextUrl.pathname.startsWith('/api') &&
        !request.nextUrl.pathname.startsWith('/favicon.ico') &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/reset-password');

    // 1. If user is NOT authenticated and tries to access protected routes
    if (!session && isProtectedPath) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If user IS authenticated and tries to access login page
    if (session && isLoginPage) {
        const dashboardUrl = new URL('/', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // 3. Optional: Logic to redirect based on department if needed in the future
    // For now, we assume root '/' is the main dashboard for all layouts.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
