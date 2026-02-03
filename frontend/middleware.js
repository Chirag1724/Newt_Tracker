import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.split(' ')[1];

    // Get user from request (we'll need to decode JWT or check localStorage client-side)
    const pathname = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Protected routes
    const isAdminRoute = pathname.startsWith('/admin');
    const isDistributorRoute = pathname.startsWith('/distributor');

    // If accessing protected route without token, redirect to login
    if ((isAdminRoute || isDistributorRoute) && !token) {
        // Note: In Next.js App Router, we handle auth protection in components
        // This middleware is mainly for server-side protection
        return NextResponse.next();
    }

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
