import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;
    const { pathname } = req.nextUrl;

    const publicRoutes = ['/login', '/a/login'];
    const protectedRoutes = ['/profile'];

    // Skip static files, images
    if (pathname.startsWith('/_next') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Already logged in → redirect away from public routes
    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }

    // Protected routes → require token
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};
