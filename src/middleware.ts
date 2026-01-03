import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ['/login', '/a/login','/profile'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};
