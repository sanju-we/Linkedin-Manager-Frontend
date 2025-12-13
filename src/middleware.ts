import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ['/login', '/a/login'];
  const protectedRoutes = ['/profile'];

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
