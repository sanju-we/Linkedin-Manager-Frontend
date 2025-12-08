// // client/src/middleware.ts
// // This file is kept for compatibility - Next.js 16 may still check for it
// // The main proxy logic is in proxy.ts
// import { NextResponse, NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//     // Re-export proxy function for compatibility
//     return proxy(req);
// }

// function proxy(req: NextRequest) {
//     const token = req.cookies.get('accessToken')?.value;
//     const { pathname } = req.nextUrl;

//     // Public routes that don't need a token
//     const publicRoutes = ['/login', '/a/login'];

//     // Protected routes that require authentication
//     const protectedRoutes = ['/profile','/a'];

//     // If accessing a protected route without token → redirect to login
//     if (protectedRoutes.includes(pathname) && !token) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // If the user is trying to access the home page (/) without a token → redirect to login
//     if (pathname === '/' && !token) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // If the user is already logged in and tries to visit a public route → send them to profile
//     if (publicRoutes.includes(pathname) && token) {
//         return NextResponse.redirect(new URL('/profile', req.url));
//     }

//     // Otherwise let the request continue (this allows /login to render when no token)
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
// };

