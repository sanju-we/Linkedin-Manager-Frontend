// client/src/middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// Simple auth‑guard middleware
export function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;
    const { pathname } = req.nextUrl;

    // Public routes that don't need a token
    const publicRoutes = ['/login', '/admin/login'];

    // Protected routes that require authentication
    const protectedRoutes = ['/profile'];

    // If accessing a protected route without token → redirect to login
    if (protectedRoutes.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If the user is trying to access the home page without a token → redirect to login
    if (pathname === '/' && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If the user is already logged in and tries to visit a public route → send them to home
    if (publicRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Otherwise let the request continue
    return NextResponse.next();
}

// Apply the middleware to all pages except static assets and API routes
export const config = {
    matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};

