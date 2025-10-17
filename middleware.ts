import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth') || req.nextUrl.pathname.startsWith('/(auth)');
  if (!token && req.nextUrl.pathname.startsWith('/api') && !isAuthRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/(auth)/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] };
